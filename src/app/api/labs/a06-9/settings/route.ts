import { NextRequest, NextResponse } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-9";
const ADMIN_WORKSPACE = "WS_ADMIN_SECRET_999";

/**
 * POST /api/labs/a06-9/settings
 * Vulnerable endpoint enabling mass assignment of properties into user session.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);
  let sessionData = await getSession(LAB_ID, sessionId);

  if (!sessionData || Object.keys(sessionData).length === 0) {
    return NextResponse.json({ success: false, message: "Active session not found." }, { status: 403 });
  }

  // Basic check: ensure user has access to the admin dashboard before updating settings there
  const workspaces = (sessionData.workspaces as string[]) || [];
  if (!workspaces.includes(ADMIN_WORKSPACE)) {
    return NextResponse.json({ success: false, message: "Unauthorized. Admin workspace token required for config updates." }, { status: 403 });
  }

  try {
    const body = await request.json();

    // INTENTIONAL VULNERABILITY: Mass Assignment via Object.assign.
    // The system is supposed to only update 'theme' and 'notification_alerts' based on the UI form, 
    // but blindly merges ALL incoming body keys directly into sessionData.
    // If the attacker provides "isVaultUnlocked": true, it gets successfully merged!
    
    Object.assign(sessionData, body);
    
    await setSession(LAB_ID, sessionId, sessionData);

    return jsonWithSession(
      {
        success: true,
        message: "Configuration updated successfully.",
        current_config: body
      },
      sessionId,
      isNew
    );

  } catch (err) {
    return NextResponse.json({ success: false, message: "Invalid payload format." }, { status: 400 });
  }
}
