import { NextRequest } from "next/server";
import {
  getOrCreateSessionId,
  setSession,
  jsonWithSession,
} from "../../_lib/sessions";

const LAB_ID = "a06-4";

/**
 * POST /api/labs/a06-4/register
 *
 * VULNERABILITY: Mass Assignment — The endpoint blindly assigns all
 * properties from the request body to the user object, including an
 * undocumented "role" parameter. The frontend form only sends
 * username and password, but the API accepts anything.
 *
 * Expected body: { "username": "...", "password": "..." }
 * Exploit: Add "role": "admin" in Burp Suite
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return jsonWithSession(
        { success: false, message: "Username and password are required." },
        sessionId,
        isNew,
        400
      );
    }

    // VULNERABLE: Mass assignment — spread all body properties into the user object
    // This allows an attacker to inject "role": "admin"
    const user = {
      role: "user", // Default role
      ...body,      // Attacker can override role here!
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Don't store the password in the session (simulated security)
    const sessionData = {
      userId: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };

    setSession(LAB_ID, sessionId, sessionData);

    return jsonWithSession(
      {
        success: true,
        message: `Account created successfully. Welcome, ${user.username}!`,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      sessionId,
      isNew,
      201
    );
  } catch {
    return jsonWithSession(
      { success: false, message: "Invalid request body. Expected JSON." },
      sessionId,
      isNew,
      400
    );
  }
}
