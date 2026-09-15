import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getAdminBucket } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const FOLDERS: Record<string, string> = {
  team: "team",
  blog: "blog",
  "case-study": "case-studies",
};

/**
 * Receives an already-cropped image blob from the admin upload widget, stores
 * it in Firebase Storage with a download token, and returns the public URL to
 * save on the content document.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const type = String(form.get("type") || "");
  const folder = FOLDERS[type];

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!folder) {
    return NextResponse.json({ error: "Unknown upload type." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG or WebP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 8 MB or smaller." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `uploads/${folder}/${Date.now()}-${base}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const token = randomUUID();
  const bucket = getAdminBucket();
  await bucket.file(path).save(buffer, {
    resumable: false,
    metadata: {
      contentType: file.type,
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    path
  )}?alt=media&token=${token}`;

  return NextResponse.json({ url });
}
