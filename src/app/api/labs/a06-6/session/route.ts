import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-6";

/**
 * GET /api/labs/a06-6/session
 * Returns the current user session for the lab.
 */
export async function GET(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  let session = getSession(LAB_ID, sessionId);
  if (!session) {
    session = { balance: 60, purchased: false };
  }

  return jsonWithSession(session, sessionId, isNew);
}
