import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  setSession,
  getSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a02-1";
const FLAG = "flag{d3f4u1t_cr3ds_r_b4d}";

/**
 * POST /api/labs/a02-1/login
 *
 * VULNERABILITY: Default Credentials — The monitoring dashboard
 * ships with admin:admin credentials that were never changed.
 * The documentation endpoint leaks this information.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return jsonWithSession(
        { success: false, message: "Username and password are required." },
        sessionId, isNew, 400
      );
    }

    // Default credentials that were never changed
    if (username === "admin" && password === "admin") {
      setSession(LAB_ID, sessionId, { authenticated: true, role: "admin", username });
      return jsonWithSession(
        {
          success: true,
          message: "Authentication successful.",
          user: { username: "admin", role: "System Administrator" },
          token: "session_" + sessionId,
        },
        sessionId, isNew
      );
    }

    // Also accept the service account
    if (username === "grafana" && password === "grafana123") {
      setSession(LAB_ID, sessionId, { authenticated: true, role: "viewer", username });
      return jsonWithSession(
        { success: true, message: "Authentication successful.", user: { username, role: "Viewer" } },
        sessionId, isNew
      );
    }

    return jsonWithSession(
      { success: false, message: "Invalid username or password." },
      sessionId, isNew, 401
    );
  } catch {
    return jsonWithSession(
      { success: false, message: "Invalid request body." },
      sessionId, isNew, 400
    );
  }
}
