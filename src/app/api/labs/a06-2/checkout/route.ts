import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-2";
const FLAG = "flag{trus7_n0_cl13nt_d4t4}";

interface A062Session {
  balance: number;
  purchased: boolean;
}

/**
 * POST /api/labs/a06-2/checkout
 *
 * VULNERABILITY: Trust Boundary Violation — the server trusts the
 * client-supplied "price" field instead of looking it up server-side.
 *
 * Expected body: { "itemId": "item_flag_ultimate", "quantity": 1, "price": 1000000 }
 * Exploit: Change "price" to 1 (or any value <= 50) in Burp Suite
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  // Initialize session if new
  let session = await getSession<A062Session>(LAB_ID, sessionId);
  if (!session) {
    session = { balance: 50, purchased: false };
    await setSession(LAB_ID, sessionId, session as unknown as Record<string, unknown>);
  }

  if (session.purchased) {
    return jsonWithSession(
      { success: false, message: "You already purchased this item." },
      sessionId,
      isNew,
      400
    );
  }

  try {
    const body = await request.json();
    const { itemId, quantity, price } = body;

    if (!itemId || !quantity || price === undefined) {
      return jsonWithSession(
        { success: false, message: "Missing required fields: itemId, quantity, price" },
        sessionId,
        isNew,
        400
      );
    }

    // VULNERABLE: Server trusts the client-supplied price!
    const totalCost = price * quantity;

    if (totalCost > session.balance) {
      return jsonWithSession(
        {
          success: false,
          message: `Insufficient funds. Your balance is $${session.balance}, but the total cost is $${totalCost}.`,
          balance: session.balance,
        },
        sessionId,
        isNew,
        402
      );
    }

    // Process purchase
    session.balance -= totalCost;
    session.purchased = true;
    await setSession(LAB_ID, sessionId, session as unknown as Record<string, unknown>);

    return jsonWithSession(
      {
        success: true,
        message: "Purchase successful! Thank you for your order.",
        orderId: `ORD-${Date.now()}`,
        item: itemId,
        chargedAmount: totalCost,
        remainingBalance: session.balance,
        flag: FLAG,
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
