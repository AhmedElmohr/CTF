import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-9";

/**
 * POST /api/labs/a06-9/invite
 * 
 * VULNERABILITY: Type Confusion / Array Bypass
 * The endpoint expects `workspace_id` to be a string.
 * It checks if the user has access to `workspace_id`.
 * But if an attacker sends an array `["WS_GUEST_101", "WS_ADMIN_SECRET_999"]`,
 * the middleware check only looks at the first element, which passes.
 * But the database execution layer loops through all elements!
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  let sessionData = await getSession(LAB_ID, sessionId);
  if (!sessionData) {
    return jsonWithSession({ success: false, message: "Unauthorized" }, sessionId, isNew, 401);
  }

  try {
    const body = await request.json();
    const { email, workspace_id } = body;

    if (!email || !workspace_id) {
      return jsonWithSession(
        { success: false, message: "Email and workspace_id are required." },
        sessionId,
        isNew,
        400
      );
    }

    const userWorkspaces = (sessionData.workspaces as string[]) || [];

    // --- VULNERABLE MIDDLEWARE LOGIC ---
    // Developer assumes workspace_id is a string, but what if it's an array?
    // If it's an array, it extracts the first element for the security check.
    const targetWorkspace = Array.isArray(workspace_id) ? workspace_id[0] : workspace_id;

    // Security Check: Does the user have access to the target workspace?
    if (!userWorkspaces.includes(targetWorkspace)) {
      return jsonWithSession(
        { success: false, message: "Forbidden: You do not have permission to invite to this workspace." },
        sessionId,
        isNew,
        403
      );
    }

    // --- VULNERABLE EXECUTION LOGIC ---
    // The developer wrote a helper to support future bulk operations, 
    // inadvertently creating a bypass.
    const workspacesToUpdate = Array.isArray(workspace_id) ? workspace_id : [workspace_id];

    // In a real app, this would insert into a DB. 
    // For the CTF, we are adding these workspaces to the user's session to simulate them gaining access.
    // If the attacker invited themselves to the admin workspace, we just grant it to them.
    
    // Simulate: If the invited email is the current user's email, they join the workspace.
    // In our simplified CTF, any successful invite just adds the workspace to the current user's session
    // to instantly show the exploit result.
    const updatedWorkspaces = [...new Set([...userWorkspaces, ...workspacesToUpdate])];
    
    await setSession(LAB_ID, sessionId, {
      ...sessionData,
      workspaces: updatedWorkspaces
    });

    return jsonWithSession(
      {
        success: true,
        message: `Successfully invited ${email} to the specified workspace(s).`,
      },
      sessionId,
      isNew,
      200
    );
  } catch (err) {
    return jsonWithSession(
      { success: false, message: "Invalid request format." },
      sessionId,
      isNew,
      400
    );
  }
}
