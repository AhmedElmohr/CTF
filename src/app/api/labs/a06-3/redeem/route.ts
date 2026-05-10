import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-3";

interface A063Session {
  balance: number;
  cardUsed: boolean;
}

/**
 * POST /api/labs/a06-3/redeem
 *
 * VULNERABILITY: Race Condition (TOCTOU) — There is a deliberate delay
 * between checking if the card is used and marking it as used.
 * Sending multiple concurrent requests allows redeeming the same card
 * multiple times before the "used" flag is set.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  // Initialize session if needed
  let session = getSession<A063Session>(LAB_ID, sessionId);
  if (!session) {
    session = { balance: 0, cardUsed: false };
    setSession(LAB_ID, sessionId, session as unknown as Record<string, unknown>);
  }

  // ===== TIME OF CHECK =====
  // Read the current state — is the card already used?
  const currentSession = getSession<A063Session>(LAB_ID, sessionId);
  if (!currentSession) {
    return jsonWithSession(
      { success: false, message: "Session error" },
      sessionId,
      isNew,
      500
    );
  }

  if (currentSession.cardUsed) {
    return jsonWithSession(
      {
        success: false,
        message: "Promo card PROMO-10-FREE has already been redeemed.",
        balance: currentSession.balance,
      },
      sessionId,
      isNew,
      400
    );
  }

  // ===== THE RACE WINDOW =====
  // Simulate processing delay (database write, payment gateway, etc.)
  // This is where the vulnerability exists — multiple requests can pass
  // the check above before any of them reach the update below.
  await new Promise((resolve) => setTimeout(resolve, 200));

  // ===== TIME OF USE =====
  // Re-read session (but in a real race, multiple threads would all
  // have passed the check above and would all execute this)
  const freshSession = getSession<A063Session>(LAB_ID, sessionId);
  if (!freshSession) {
    return jsonWithSession(
      { success: false, message: "Session error" },
      sessionId,
      isNew,
      500
    );
  }

  // Add $10 to balance
  freshSession.balance += 10;
  freshSession.cardUsed = true;
  setSession(LAB_ID, sessionId, freshSession as unknown as Record<string, unknown>);

  return jsonWithSession(
    {
      success: true,
      message: "Promo card PROMO-10-FREE redeemed successfully! $10 added to your balance.",
      balance: freshSession.balance,
    },
    sessionId,
    isNew
  );
}
