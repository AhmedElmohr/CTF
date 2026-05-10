import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'ctf.db');
const db = new Database(dbPath);

// Initialize Bank Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS lab_a06_8_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    account_number TEXT UNIQUE,
    egp_balance REAL DEFAULT 2500.0,
    usd_balance REAL DEFAULT 10.0,
    spc_balance REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface BankUser {
  id: number;
  email: string;
  full_name: string;
  account_number: string;
  egp_balance: number;
  usd_balance: number;
  spc_balance: number;
}

export const bankDb = {
  createUser: (email: string, pass: string, name: string) => {
    const accNo = 'SPARK-' + Math.floor(100000000 + Math.random() * 900000000).toString();
    const stmt = db.prepare('INSERT INTO lab_a06_8_users (email, password, full_name, account_number) VALUES (?, ?, ?, ?)');
    const info = stmt.run(email, pass, name, accNo);
    return info.lastInsertRowid;
  },

  getUserByEmail: (email: string) => {
    return db.prepare('SELECT * FROM lab_a06_8_users WHERE email = ?').get(email) as any;
  },

  getUserByAccount: (accNo: string) => {
    return db.prepare('SELECT * FROM lab_a06_8_users WHERE account_number = ?').get(accNo) as any;
  },

  updateBalance: (userId: number, currency: string, amount: number) => {
    const column = currency.toLowerCase() + '_balance';
    db.prepare(`UPDATE lab_a06_8_users SET ${column} = ${column} + ? WHERE id = ?`).run(amount, userId);
  },

  // Atomic Transfer
  transfer: (fromId: number, toAccNo: string, amount: number, fromCurrency: string, toCurrency?: string) => {
    const fromCol = fromCurrency.toLowerCase() + '_balance';
    const toCol = (toCurrency || fromCurrency).toLowerCase() + '_balance';
    const toUser = db.prepare('SELECT id FROM lab_a06_8_users WHERE account_number = ?').get(toAccNo) as any;
    
    if (!toUser) throw new Error("Recipient account not found.");

    const transaction = db.transaction(() => {
      // Deduct from sender
      db.prepare(`UPDATE lab_a06_8_users SET ${fromCol} = ${fromCol} - ? WHERE id = ?`).run(amount, fromId);
      // Add to recipient (potentially different currency but same numeric value!)
      db.prepare(`UPDATE lab_a06_8_users SET ${toCol} = ${toCol} + ? WHERE id = ?`).run(amount, toUser.id);
    });

    transaction();
    return true;
  }
};
