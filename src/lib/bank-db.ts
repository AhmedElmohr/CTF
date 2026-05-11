import { kv } from "@vercel/kv";

const isKVEnabled = () => !!process.env.KV_REST_API_URL;

const globalForBank = globalThis as unknown as {
  memUsersByEmail: Map<string, any>;
  memUsersByAcc: Map<string, any>;
};

// In-memory fallback for local development without KV
const memUsersByEmail = globalForBank.memUsersByEmail || new Map<string, any>();
const memUsersByAcc = globalForBank.memUsersByAcc || new Map<string, any>();

if (process.env.NODE_ENV !== "production") {
  globalForBank.memUsersByEmail = memUsersByEmail;
  globalForBank.memUsersByAcc = memUsersByAcc;
}

export interface BankUser {
  id: number;
  email: string;
  password?: string;
  full_name: string;
  account_number: string;
  egp_balance: number;
  usd_balance: number;
  spc_balance: number;
}

const emailKey = (email: string) => `bank:u:e:${email.toLowerCase()}`;
const accKey = (acc: string) => `bank:u:a:${acc}`;

export const bankDb = {
  createUser: async (email: string, pass: string, name: string): Promise<void> => {
    const emailLower = email.toLowerCase();
    const accNo = 'SPARK-' + Math.floor(100000000 + Math.random() * 900000000).toString();
    const newUser: BankUser = {
      id: Date.now(),
      email: emailLower,
      password: pass, // Simple text for lab
      full_name: name,
      account_number: accNo,
      egp_balance: 2500.0,
      usd_balance: 10.0,
      spc_balance: 0.0,
    };

    if (isKVEnabled()) {
      // Atomically set mappings
      await kv.set(emailKey(emailLower), newUser);
      await kv.set(accKey(accNo), newUser);
    } else {
      memUsersByEmail.set(emailLower, newUser);
      memUsersByAcc.set(accNo, newUser);
    }
  },

  getUserByEmail: async (email: string): Promise<BankUser | null> => {
    const emailLower = email.toLowerCase();
    if (isKVEnabled()) {
      const user = await kv.get<BankUser>(emailKey(emailLower));
      return user || null;
    } else {
      return memUsersByEmail.get(emailLower) || null;
    }
  },

  getUserByAccount: async (accNo: string): Promise<BankUser | null> => {
    if (isKVEnabled()) {
      const user = await kv.get<BankUser>(accKey(accNo));
      return user || null;
    } else {
      return memUsersByAcc.get(accNo) || null;
    }
  },

  updateBalance: async (userId: any, currency: string, amount: number, email: string): Promise<void> => {
    // Note: The existing API calls this with userId but then passes email for context. 
    // Since we refactor to use KV, finding by email is best.
    const user = await bankDb.getUserByEmail(email);
    if (!user) return;

    const col = (currency.toLowerCase() + '_balance') as keyof BankUser;
    (user as any)[col] = Number((user as any)[col] || 0) + Number(amount);

    if (isKVEnabled()) {
      await kv.set(emailKey(user.email), user);
      await kv.set(accKey(user.account_number), user);
    } else {
      memUsersByEmail.set(user.email, user);
      memUsersByAcc.set(user.account_number, user);
    }
  },

  transfer: async (fromEmail: string, toAccNo: string, amount: number, fromCurrency: string, toCurrency?: string): Promise<boolean> => {
    const fromUser = await bankDb.getUserByEmail(fromEmail);
    const toUser = await bankDb.getUserByAccount(toAccNo);

    if (!fromUser) throw new Error("Sender not found.");
    if (!toUser) throw new Error("Recipient account not found.");

    const fromCol = (fromCurrency.toLowerCase() + '_balance') as keyof BankUser;
    const toCol = ((toCurrency || fromCurrency).toLowerCase() + '_balance') as keyof BankUser;

    // Update balances
    (fromUser as any)[fromCol] = Number((fromUser as any)[fromCol] || 0) - Number(amount);
    (toUser as any)[toCol] = Number((toUser as any)[toCol] || 0) + Number(amount);

    // Save updates
    if (isKVEnabled()) {
        await kv.set(emailKey(fromUser.email), fromUser);
        await kv.set(accKey(fromUser.account_number), fromUser);

        await kv.set(emailKey(toUser.email), toUser);
        await kv.set(accKey(toUser.account_number), toUser);
    } else {
        memUsersByEmail.set(fromUser.email, fromUser);
        memUsersByAcc.set(fromUser.account_number, fromUser);
        memUsersByEmail.set(toUser.email, toUser);
        memUsersByAcc.set(toUser.account_number, toUser);
    }
    return true;
  }
};
