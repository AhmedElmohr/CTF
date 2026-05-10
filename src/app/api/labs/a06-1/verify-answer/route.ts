import { NextRequest } from "next/server";
import { getOrCreateSessionId, getSession, jsonWithSession } from "../../_lib/sessions";

const LAB_ID = "a06-1";
const FLAG = "flag{r3c0v3ry_l0g1c_OSINT_fl4w}";

const ANSWERS: Record<string, string> = {
  "admin": "max",
  "m.becker": "max",
  "ceo": "max",
  "s.jenkins": "portland",
};

interface A061Session {
  username: string;
  step: string;
}

/**
 * POST /api/labs/a06-1/verify-answer
 *
 * VULNERABILITY: Weak Password Recovery — The security question
 * "What is my dog's name?" is easily answerable via OSINT from
 * the company's public About Us page.
 */
export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);
  const session = getSession<A061Session>(LAB_ID, sessionId);

  if (!session || session.step !== "question") {
    return jsonWithSession(
      { success: false, message: "Please look up a username first at POST /api/labs/a06-1/forgot" },
      sessionId, isNew, 400
    );
  }

  try {
    const body = await request.json();
    const { answer } = body;

    if (!answer) {
      return jsonWithSession({ success: false, message: "Answer is required." }, sessionId, isNew, 400);
    }

    const correctAnswer = ANSWERS[session.username];

    if (answer.toLowerCase().trim() === correctAnswer) {
      return jsonWithSession(
        {
          success: true,
          message: `Password reset successful for ${session.username}!`,
          newTemporaryPassword: "TempPass_" + Math.random().toString(36).slice(2, 8),
          flag: FLAG,
          explanation: "You bypassed authentication by exploiting a weak security question using OSINT. The CEO's dog name 'Max' was publicly available on the About Us page.",
        },
        sessionId, isNew
      );
    }

    return jsonWithSession(
      { success: false, message: "Incorrect answer to security question." },
      sessionId, isNew, 403
    );
  } catch {
    return jsonWithSession({ success: false, message: "Invalid request body." }, sessionId, isNew, 400);
  }
}
