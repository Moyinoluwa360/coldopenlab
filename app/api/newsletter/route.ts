import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Public endpoint for the footer newsletter signup. Forwards name + email to
 * a Google Apps Script Web App bound to the client's Google Sheet, which
 * appends a row. See README for the Apps Script setup.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const webhookUrl = process.env.NEWSLETTER_SHEET_WEBHOOK_URL;
  const secret = process.env.NEWSLETTER_SHEET_SECRET;
  if (!webhookUrl || !secret) {
    console.warn("[newsletter] NEWSLETTER_SHEET_WEBHOOK_URL / NEWSLETTER_SHEET_SECRET not configured.");
    return NextResponse.json({ error: "Newsletter signup is not configured yet." }, { status: 503 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name, email, secret }),
    });
    if (!res.ok) {
      throw new Error(`Sheet webhook responded ${res.status}`);
    }
  } catch (err) {
    console.error("[newsletter] failed to record signup:", (err as Error).message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
