import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-6";

/**
 * POST /api/labs/a06-6/reset
 * Resets the lab session for the user.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  // Reset the session to initial state
  const initialSession = { balance: 60, purchased: false };
  await setSession(LAB_ID, sessionId, initialSession as unknown as Record<string, unknown>);

  return jsonWithSession({ success: true, message: "Lab session reset successfully." }, sessionId, isNew);
}
