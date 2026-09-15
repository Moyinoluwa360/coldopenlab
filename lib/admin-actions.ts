"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminDb } from "./firebase-admin";
import { requireAdmin } from "./auth";
import { COLLECTIONS } from "./data";
import { slugify } from "./slug";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Admin mutations. Every action re-verifies the admin session server-side via
 * requireAdmin() before writing, then revalidates the affected public routes so
 * changes appear immediately. Called from the admin form client components.
 */

/* ------------------------------- Blog ---------------------------------- */

export interface BlogInput {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  category: string;
  publishDate: string;
  published: boolean;
  featuredImageUrl: string;
  featuredImageAlt: string;
}

export async function saveBlogPost(input: BlogInput) {
  await requireAdmin();
  const db = getAdminDb();
  const slug = slugify(input.slug || input.title);
  const data = {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    bodyHtml: input.bodyHtml,
    category: input.category.trim(),
    publishDate: input.publishDate,
    published: Boolean(input.published),
    featuredImageUrl: input.featuredImageUrl,
    featuredImageAlt: input.featuredImageAlt.trim(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (input.id) {
    await db.collection(COLLECTIONS.blog).doc(input.id).set(data, { merge: true });
  } else {
    await db.collection(COLLECTIONS.blog).add({ ...data, createdAt: FieldValue.serverTimestamp() });
  }
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string, slug: string) {
  await requireAdmin();
  await getAdminDb().collection(COLLECTIONS.blog).doc(id).delete();
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog");
}

/* ---------------------------- Case studies ----------------------------- */

export interface CaseStudyInput {
  id?: string;
  title: string;
  slug: string;
  clientCategory: string;
  summary: string;
  bodyHtml: string;
  proofTags: string[];
  workInProgress: boolean;
  published: boolean;
  heroImageUrl: string;
  heroImageAlt: string;
}

export async function saveCaseStudy(input: CaseStudyInput) {
  await requireAdmin();
  const db = getAdminDb();
  const slug = slugify(input.slug || input.title);
  const data = {
    title: input.title.trim(),
    slug,
    clientCategory: input.clientCategory.trim(),
    summary: input.summary.trim(),
    bodyHtml: input.bodyHtml,
    proofTags: input.proofTags.map((t) => t.trim()).filter(Boolean),
    workInProgress: Boolean(input.workInProgress),
    published: Boolean(input.published),
    heroImageUrl: input.heroImageUrl,
    heroImageAlt: input.heroImageAlt.trim(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (input.id) {
    await db.collection(COLLECTIONS.caseStudies).doc(input.id).set(data, { merge: true });
  } else {
    await db
      .collection(COLLECTIONS.caseStudies)
      .add({ ...data, createdAt: FieldValue.serverTimestamp() });
  }
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect("/admin/case-studies");
}

export async function deleteCaseStudy(id: string, slug: string) {
  await requireAdmin();
  await getAdminDb().collection(COLLECTIONS.caseStudies).doc(id).delete();
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  redirect("/admin/case-studies");
}

/* ---------------------------- Testimonials ----------------------------- */

export interface TestimonialInput {
  id?: string;
  quote: string;
  clientName: string;
  clientRole: string;
  category: string;
  published: boolean;
}

export async function saveTestimonial(input: TestimonialInput) {
  await requireAdmin();
  const db = getAdminDb();
  const data = {
    quote: input.quote.trim(),
    clientName: input.clientName.trim(),
    clientRole: input.clientRole.trim(),
    category: input.category.trim(),
    published: Boolean(input.published),
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (input.id) {
    await db.collection(COLLECTIONS.testimonials).doc(input.id).set(data, { merge: true });
  } else {
    await db
      .collection(COLLECTIONS.testimonials)
      .add({ ...data, createdAt: FieldValue.serverTimestamp() });
  }
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await getAdminDb().collection(COLLECTIONS.testimonials).doc(id).delete();
  revalidatePath("/");
  redirect("/admin/testimonials");
}

/* ------------------------------- Team ---------------------------------- */

export interface TeamInput {
  id?: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  photoAlt: string;
  order: number;
}

export async function saveTeamMember(input: TeamInput) {
  await requireAdmin();
  const db = getAdminDb();
  const data = {
    name: input.name.trim(),
    role: input.role.trim(),
    bio: input.bio.trim(),
    photoUrl: input.photoUrl,
    photoAlt: input.photoAlt.trim(),
    order: Number.isFinite(input.order) ? input.order : 0,
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (input.id) {
    await db.collection(COLLECTIONS.team).doc(input.id).set(data, { merge: true });
  } else {
    await db.collection(COLLECTIONS.team).add({ ...data, createdAt: FieldValue.serverTimestamp() });
  }
  revalidatePath("/about");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  await getAdminDb().collection(COLLECTIONS.team).doc(id).delete();
  revalidatePath("/about");
  redirect("/admin/team");
}
