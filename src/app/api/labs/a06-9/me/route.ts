import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  getSession,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-9";
const ADMIN_WORKSPACE = "WS_ADMIN_SECRET_999";
const FLAG = "spark_ctf{tyP3_c0nfUs10n_m4ss_4ss1gnm3nt_m4st3r}";

export async function GET(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  let sessionData = await getSession(LAB_ID, sessionId);

  if (!sessionData || Object.keys(sessionData).length === 0) {
    // Initialize standard user
    sessionData = {
      email: "guest@b2b-portal.local",
      workspaces: ["WS_GUEST_101"],
      isAdmin: false
    };
    await setSession(LAB_ID, sessionId, sessionData);
  }

  // Check if they somehow gained access to the admin workspace
  const workspaces = (sessionData.workspaces as string[]) || [];
  const isAdminNow = workspaces.includes(ADMIN_WORKSPACE);

  const isUnlocked = !!sessionData.isVaultUnlocked;

  return jsonWithSession(
    {
      success: true,
      user: {
        email: sessionData.email,
        workspaces: sessionData.workspaces,
        isAdmin: isAdminNow,
        isVaultUnlocked: isUnlocked
      },
      flag: (isAdminNow && isUnlocked) ? FLAG : (isAdminNow ? "LOCKED_VAULT_ENCRYPTED_PAYLOAD_0x8fa2e" : null),
      adminWorkspaceId: ADMIN_WORKSPACE 
    },
    sessionId,
    isNew
  );
}
