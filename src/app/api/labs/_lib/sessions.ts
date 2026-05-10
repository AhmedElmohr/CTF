import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

/**
 * In-memory session store for lab environments.
 * Each lab has its own namespace to prevent cross-lab interference.
 * Key format: "labId:sessionId"
 */
const store = new Map<string, Record<string, unknown>>();

const COOKIE_NAME = "lab-session";

export function getSessionId(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value ?? null;
}

export function getOrCreateSessionId(request: NextRequest): {
  sessionId: string;
  isNew: boolean;
} {
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (existing) return { sessionId: existing, isNew: false };
  return { sessionId: randomUUID(), isNew: true };
}

export function setSessionCookie(response: NextResponse, sessionId: string): NextResponse {
  response.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: false, // Allow JS to read for reset functionality
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
  });
  return response;
}

function key(labId: string, sessionId: string): string {
  return `${labId}:${sessionId}`;
}

export function getSession<T = Record<string, unknown>>(
  labId: string,
  sessionId: string
): T | null {
  const data = store.get(key(labId, sessionId));
  return (data as T) ?? null;
}

export function setSession(
  labId: string,
  sessionId: string,
  data: Record<string, unknown>
): void {
  store.set(key(labId, sessionId), data);
}

export function resetSession(labId: string, sessionId: string): void {
  store.delete(key(labId, sessionId));
}

/**
 * Helper: wraps a JSON response with session cookie if new session
 */
export function jsonWithSession(
  data: unknown,
  sessionId: string,
  isNew: boolean,
  status = 200
): NextResponse {
  const response = NextResponse.json(data, { status });
  if (isNew) {
    setSessionCookie(response, sessionId);
  }
  return response;
}
