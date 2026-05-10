import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-4";
const FLAG = "flag{pr1v_3sc_v1a_1d0r}";

interface A064Session {
  userId: string;
  username: string;
  role: string;
  createdAt: string;
}

/**
 * GET /api/labs/a06-4/admin
 *
 * Admin-only endpoint. Returns the flag if the user's session
 * has role === "admin". The only way to get admin role is via
 * the mass assignment vulnerability in the register endpoint.
 */
export async function GET(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  const session = getSession<A064Session>(LAB_ID, sessionId);

  if (!session) {
    return jsonWithSession(
      { success: false, message: "Unauthorized. Please register first." },
      sessionId,
      isNew,
      401
    );
  }

  if (session.role !== "admin") {
    return jsonWithSession(
      {
        success: false,
        message: `Access Denied. Your role is "${session.role}". Admin privileges required.`,
        user: {
          username: session.username,
          role: session.role,
        },
      },
      sessionId,
      isNew,
      403
    );
  }

  return jsonWithSession(
    {
      success: true,
      message: "Welcome, Administrator. Here is the classified information.",
      user: {
        username: session.username,
        role: session.role,
      },
      adminPanel: {
        totalUsers: 1337,
        serverStatus: "operational",
        flag: FLAG,
      },
    },
    sessionId,
    isNew
  );
}
