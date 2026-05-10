import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-6";
const FLAG = "flag{c0up0n_st4ck1ng_l0g1c_br34k}";

interface A066Session {
  balance: number;
  purchased: boolean;
}

const PROMOS: Record<string, { type: 'percent' | 'fixed', value: number }> = {
  "WELCOME20": { type: 'percent', value: 20 },
  "EMPLOYEE50": { type: 'percent', value: 50 },
  "REWARD30": { type: 'fixed', value: 30 },
};

export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  let session = getSession<A066Session>(LAB_ID, sessionId);
  if (!session) {
    session = { balance: 60, purchased: false };
    setSession(LAB_ID, sessionId, session as unknown as Record<string, unknown>);
  }

  if (session.purchased) {
    return jsonWithSession(
      { success: false, message: "This one-time launch offer was already used." },
      sessionId,
      isNew,
      400
    );
  }

  try {
    const body = await request.json();
    const promoCodes = Array.isArray(body.promoCodes) ? body.promoCodes : [];
    const cart = Array.isArray(body.cart) ? body.cart : [];
    
    // Define product prices for backend calculation
    const PRICES: Record<string, number> = {
      "item-1": 190.00,
      "item-2": 50.00,
      "item-3": 15.00,
      "item-4": 25.00,
    };

    let subtotal = cart.reduce((acc: number, item: any) => {
      const price = PRICES[item.id] || 0;
      return acc + (price * (item.qty || 0));
    }, 0);

    const shipping = 15;
    let couponDiscount = 0;
    let loyaltyCredit = 0;

    // VULNERABILITY: Coupon Stacking & Duplication
    for (const code of promoCodes) {
      const promo = PROMOS[code.toUpperCase()];
      if (promo) {
        if (promo.type === 'percent') {
          couponDiscount += (subtotal * promo.value) / 100;
        } else if (promo.type === 'fixed') {
          loyaltyCredit += promo.value;
        }
      }
    }

    const totalPayable = subtotal - couponDiscount - loyaltyCredit + shipping;

    if (totalPayable > session.balance) {
      return jsonWithSession(
        {
          success: false,
          message: `Payment declined. Wallet balance is $${session.balance.toFixed(2)}. Total is $${totalPayable.toFixed(2)}.`,
          payable: totalPayable,
          balance: session.balance,
        },
        sessionId,
        isNew,
        402
      );
    }

    session.balance -= Math.max(totalPayable, 0);
    session.purchased = true;
    setSession(LAB_ID, sessionId, session as unknown as Record<string, unknown>);

    const exploited = totalPayable <= 0;

    return jsonWithSession(
      {
        success: true,
        orderId: `INV-${Date.now()}`,
        message: "Order approved.",
        chargedAmount: totalPayable,
        remainingBalance: session.balance,
        ...(exploited
          ? {
              exploit: "Coupon stacking policy bypass confirmed.",
              flag: FLAG,
            }
          : {}),
      },
      sessionId,
      isNew
    );
  } catch {
    return jsonWithSession(
      { success: false, message: "Invalid request body. Expected JSON." },
      sessionId,
      isNew,
      400
    );
  }
}
