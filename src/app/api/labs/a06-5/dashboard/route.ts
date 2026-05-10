import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-5";
const FLAG = "flag{w0rkfl0w_by_p4ss3d_3z}";

interface A065Session {
  email: string;
  verified: boolean;
  signedUpAt: string;
}

/**
 * GET /api/labs/a06-5/dashboard
 *
 * VULNERABILITY: Workflow Bypass / Forced Browsing — This endpoint
 * only checks if the user HAS a session (signed up), but does NOT
 * verify that the user completed the OTP verification step.
 *
 * A secure implementation would check: session.verified === true
 * This one only checks: session !== null
 */
export async function GET(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  const session = await getSession<A065Session>(LAB_ID, sessionId);

  if (!session) {
    return jsonWithSession(
      {
        success: false,
        message: "Unauthorized. Please sign up first at POST /api/labs/a06-5/signup",
      },
      sessionId,
      isNew,
      401
    );
  }

  // VULNERABLE: Only checks if session exists, NOT if verified === true
  // A secure version would have:
  // if (!session.verified) return 403 "Email not verified"

  return jsonWithSession(
    {
      success: true,
      message: "Welcome to the secure dashboard!",
      user: {
        email: session.email,
        verified: session.verified, // Shows false — proving the bypass
        signedUpAt: session.signedUpAt,
      },
      confidentialData: {
        internalNote: "Notice: verified=false but access was still granted. This is the vulnerability.",
        flag: FLAG,
      },
    },
    sessionId,
    isNew
  );
}
