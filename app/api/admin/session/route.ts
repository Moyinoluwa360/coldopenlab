import { NextResponse } from "next/server";
import { createSession, clearSession } from "@/lib/auth";

// Session cookie creation/verification needs the Admin SDK → Node runtime.
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
    }
    await createSession(idToken);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Sign-in failed." },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  clearSession();
  return NextResponse.json({ ok: true });
}
