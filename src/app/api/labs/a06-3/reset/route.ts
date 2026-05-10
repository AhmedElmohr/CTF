import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-3";

export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  // Reset to initial state
  const initialSession = { balance: 0, cardUsed: false };
  await setSession(LAB_ID, sessionId, initialSession as unknown as Record<string, unknown>);

  return jsonWithSession(
    { success: true, message: "Lab session reset successfully." },
    sessionId,
    isNew
  );
}
