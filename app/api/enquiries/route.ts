import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { COLLECTIONS } from "@/lib/data";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";

const REQUIRED_STRINGS = ["name", "email", "phone", "business", "description", "customers", "help"] as const;

/**
 * Public endpoint for the contact-page lead form. No admin session required —
 * anyone can submit an enquiry. Only saves to Firestore; no email is sent yet.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  for (const key of REQUIRED_STRINGS) {
    if (typeof body[key] !== "string" || !(body[key] as string).trim()) {
      return NextResponse.json({ error: `Missing required field: ${key}.` }, { status: 400 });
    }
  }
  const marketing = Array.isArray(body.marketing) ? body.marketing.map(String).filter(Boolean) : [];
  if (marketing.length === 0) {
    return NextResponse.json({ error: "Select at least one marketing option." }, { status: 400 });
  }

  const data = {
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    phone: String(body.phone).trim(),
    business: String(body.business).trim(),
    description: String(body.description).trim(),
    customers: String(body.customers).trim(),
    marketing,
    website: typeof body.website === "string" ? body.website.trim() : "",
    help: String(body.help).trim(),
    viewed: false,
    createdAt: FieldValue.serverTimestamp(),
  };

  try {
    await getAdminDb().collection(COLLECTIONS.enquiries).add(data);
  } catch (err) {
    console.error("[enquiries] failed to save:", (err as Error).message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
