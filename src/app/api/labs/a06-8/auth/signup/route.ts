import { NextRequest, NextResponse } from "next/server";
import { bankDb } from "@/lib/bank-db";
import { getOrCreateSessionId, jsonWithSession } from "../../../_lib/sessions";

export async function POST(request: NextRequest) {
  const { sessionId, isNew } = getOrCreateSessionId(request);
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    const existing = await bankDb.getUserByEmail(email);
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    await bankDb.createUser(email, password, name);
    const user = await bankDb.getUserByEmail(email);
    
    return jsonWithSession({ success: true, user }, sessionId, isNew);
  } catch (err) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
