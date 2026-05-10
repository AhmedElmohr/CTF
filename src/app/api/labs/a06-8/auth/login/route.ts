import { NextRequest, NextResponse } from "next/server";
import { bankDb } from "@/lib/bank-db";
import { getOrCreateSessionId, jsonWithSession } from "../../../_lib/sessions";

export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);
  try {
    const { email, password } = await request.json();
    const user = bankDb.getUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // In a real app we'd set a JWT or session cookie, for this lab we'll just return user data
    return jsonWithSession({ success: true, user }, sessionId, isNew);
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
