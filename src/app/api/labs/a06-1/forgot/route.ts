import { NextRequest } from "next/server";
import { getOrCreateSessionId, setSession, jsonWithSession } from "../../_lib/sessions";

const LAB_ID = "a06-1";

const USERS: Record<string, { question: string; answer: string; fullName: string }> = {
  "admin": { question: "What is my dog's name?", answer: "max", fullName: "Mark Becker" },
  "m.becker": { question: "What is my dog's name?", answer: "max", fullName: "Mark Becker" },
  "ceo": { question: "What is my dog's name?", answer: "max", fullName: "Mark Becker" },
  "s.jenkins": { question: "What city were you born in?", answer: "portland", fullName: "Sarah Jenkins" },
};

/**
 * POST /api/labs/a06-1/forgot
 *
 * Step 1: Look up a username and return the associated security question.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);

  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return jsonWithSession({ success: false, message: "Username is required." }, sessionId, isNew, 400);
    }

    const user = USERS[username.toLowerCase()];
    if (!user) {
      return jsonWithSession(
        { success: false, message: `User '${username}' not found in the system.` },
        sessionId, isNew, 404
      );
    }

    setSession(LAB_ID, sessionId, { username: username.toLowerCase(), step: "question" });

    return jsonWithSession(
      {
        success: true,
        message: `Security question found for ${user.fullName}.`,
        user: { username: username.toLowerCase(), fullName: user.fullName },
        securityQuestion: user.question,
        nextStep: "POST /api/labs/a06-1/verify-answer",
      },
      sessionId, isNew
    );
  } catch {
    return jsonWithSession({ success: false, message: "Invalid request body." }, sessionId, isNew, 400);
  }
}
