import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-5";

/**
 * POST /api/labs/a06-5/verify
 *
 * Step 2: OTP verification. This endpoint ALWAYS returns failure
 * because the user doesn't have access to the email inbox.
 * This forces the user to find another way to reach the dashboard.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  const session = getSession(LAB_ID, sessionId);

  if (!session) {
    return jsonWithSession(
      { success: false, message: "No active signup session. Please sign up first." },
      sessionId,
      isNew,
      401
    );
  }

  try {
    const body = await request.json();
    const { otp } = body;

    if (!otp) {
      return jsonWithSession(
        { success: false, message: "OTP code is required." },
        sessionId,
        isNew,
        400
      );
    }

    // ALWAYS reject — the user can never legitimately verify
    return jsonWithSession(
      {
        success: false,
        message: "Invalid OTP code. Please check your email and try again.",
        attemptsRemaining: 2,
      },
      sessionId,
      isNew,
      403
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
