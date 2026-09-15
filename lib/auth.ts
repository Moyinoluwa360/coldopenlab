import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase-admin";

/**
 * Admin session handling. A single admin account (ADMIN_EMAIL) is allowed.
 * Login verifies a Firebase ID token, confirms it belongs to ADMIN_EMAIL, then
 * mints a session cookie. Every admin request re-verifies that cookie server-side.
 */

export const SESSION_COOKIE = "col_session";
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

function adminEmail(): string {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

/** Verify an ID token belongs to the admin, then create a session cookie. */
export async function createSession(idToken: string): Promise<void> {
  const decoded = await getAdminAuth().verifyIdToken(idToken, true);
  const email = (decoded.email || "").toLowerCase();
  if (!adminEmail() || email !== adminEmail()) {
    throw new Error("This account is not authorized for the admin panel.");
  }
  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });
  cookies().set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS / 1000,
  });
}

export function clearSession(): void {
  cookies().delete(SESSION_COOKIE);
}

export interface AdminUser {
  uid: string;
  email: string;
}

/** Returns the signed-in admin, or null. Safe to call anywhere server-side. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const cookie = cookies().get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(cookie, true);
    const email = (decoded.email || "").toLowerCase();
    if (!adminEmail() || email !== adminEmail()) return null;
    return { uid: decoded.uid, email };
  } catch {
    return null;
  }
}

/** Throws if not authenticated — use to guard server actions / API routes. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authenticated.");
  return user;
}
