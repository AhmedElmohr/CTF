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
 * GET /api/labs/a06-3/balance
 *
 * Returns the current session balance for the Race Condition lab.
 */
export async function GET(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  const session = await getSession<A063Session>(LAB_ID, sessionId);

  return jsonWithSession(
    {
      balance: session?.balance ?? 0,
      cardUsed: session?.cardUsed ?? false,
    },
    sessionId,
    isNew
  );
}
