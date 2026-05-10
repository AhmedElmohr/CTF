import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-3";
const FLAG = "flag{r4c3_t0_th3_f1n1sh_l1n3}";
const FLAG_COST = 50;

interface A063Session {
  balance: number;
  cardUsed: boolean;
}

/**
 * POST /api/labs/a06-3/buy-flag
 *
 * Allows purchasing the flag if the balance is >= $50.
 * The only legitimate way to get $50 is by exploiting the race condition
 * to redeem the $10 promo card multiple times.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  const session = await getSession<A063Session>(LAB_ID, sessionId);

  if (!session) {
    return jsonWithSession(
      { success: false, message: "No active session. Redeem a card first." },
      sessionId,
      isNew,
      400
    );
  }

  if (session.balance < FLAG_COST) {
    return jsonWithSession(
      {
        success: false,
        message: `Insufficient funds. You need $${FLAG_COST} but only have $${session.balance}.`,
        balance: session.balance,
      },
      sessionId,
      isNew,
      402
    );
  }

  // Deduct and return flag
  session.balance -= FLAG_COST;
  await setSession(LAB_ID, sessionId, session as unknown as Record<string, unknown>);

  return jsonWithSession(
    {
      success: true,
      message: "Order #SG-7721 confirmed! Your Cyber Flag X hardware key is being prepared for secure delivery.",
      flag: FLAG,
      remainingBalance: session.balance,
    },
    sessionId,
    isNew
  );
}
