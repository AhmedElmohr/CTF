import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-5";

/**
 * POST /api/labs/a06-5/signup
 *
 * Step 1 of the workflow: Creates a user session with verified=false.
 * After signup, the user is supposed to verify their email via OTP
 * before accessing the dashboard.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return jsonWithSession(
        { success: false, message: "Email and password are required." },
        sessionId,
        isNew,
        400
      );
    }

    // Create session with verified=false
    await setSession(LAB_ID, sessionId, {
      email,
      verified: false,
      signedUpAt: new Date().toISOString(),
    });

    return jsonWithSession(
      {
        success: true,
        message: `A 6-digit OTP has been sent to ${email}. Please verify your email to continue.`,
        nextStep: "/api/labs/a06-5/verify",
      },
      sessionId,
      isNew,
      201
    );
  } catch {
    return jsonWithSession(
      { success: false, message: "Invalid request body." },
      sessionId,
      isNew,
      400
    );
  }
}
