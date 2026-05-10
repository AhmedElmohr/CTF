import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { kv } from "@vercel/kv";

/**
 * Session store for lab environments.
 * Uses Vercel KV if configured (for serverless environments),
 * otherwise falls back to in-memory Map (for local testing).
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

const isKVEnabled = () => !!process.env.KV_REST_API_URL;

export async function getSession<T = Record<string, unknown>>(
  labId: string,
  sessionId: string
): Promise<T | null> {
  const k = key(labId, sessionId);
  if (isKVEnabled()) {
    try {
      const data = await kv.get(k);
      return (data as T) ?? null;
    } catch (e) {
      console.error("KV getSession error:", e);
      return null;
    }
  } else {
    const data = store.get(k);
    return data ? (JSON.parse(JSON.stringify(data)) as T) : null;
  }
}

// Bypasses React's fetch memoization by using mget instead of get
export async function getSessionBypassCache<T = Record<string, unknown>>(
  labId: string,
  sessionId: string
): Promise<T | null> {
  const k = key(labId, sessionId);
  if (isKVEnabled()) {
    try {
      const [data] = await kv.mget(k);
      return (data as T) ?? null;
    } catch (e) {
      console.error("KV getSessionBypassCache error:", e);
      return null;
    }
  } else {
    const data = store.get(k);
    return data ? (JSON.parse(JSON.stringify(data)) as T) : null;
  }
}

export async function setSession(
  labId: string,
  sessionId: string,
  data: Record<string, unknown>
): Promise<void> {
  const k = key(labId, sessionId);
  if (isKVEnabled()) {
    try {
      await kv.set(k, data);
    } catch (e) {
      console.error("KV setSession error:", e);
    }
  } else {
    // Store a clone to simulate db serialization behavior
    store.set(k, JSON.parse(JSON.stringify(data)));
  }
}

export async function resetSession(labId: string, sessionId: string): Promise<void> {
  const k = key(labId, sessionId);
  if (isKVEnabled()) {
    try {
      await kv.del(k);
    } catch (e) {
      console.error("KV resetSession error:", e);
    }
  } else {
    store.delete(k);
  }
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
