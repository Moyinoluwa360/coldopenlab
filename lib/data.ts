import "server-only";

import { getAdminDb } from "./firebase-admin";
import type { BlogPost, CaseStudy, Testimonial, TeamMember } from "./types";

/**
 * Server-side data access. All reads go through the Admin SDK.
 * Public pages call the `getPublished*` / `get*BySlug` helpers; the admin panel
 * calls the `getAll*` helpers plus the create/update/delete mutators.
 *
 * Firestore docs may carry non-serializable fields (Timestamps). Each mapper
 * returns a plain, fully-serializable object safe to pass from a Server
 * Component to a Client Component.
 */

const COLLECTIONS = {
  blog: "blogPosts",
  caseStudies: "caseStudies",
  testimonials: "testimonials",
  team: "teamMembers",
} as const;

type Doc = FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot;

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function mapBlog(doc: Doc): BlogPost {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    title: str(d.title),
    slug: str(d.slug),
    excerpt: str(d.excerpt),
    bodyHtml: str(d.bodyHtml),
    category: str(d.category),
    publishDate: str(d.publishDate),
    published: bool(d.published),
    featuredImageUrl: str(d.featuredImageUrl),
    featuredImageAlt: str(d.featuredImageAlt),
  };
}

function mapCaseStudy(doc: Doc): CaseStudy {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    title: str(d.title),
    slug: str(d.slug),
    clientCategory: str(d.clientCategory),
    summary: str(d.summary),
    bodyHtml: str(d.bodyHtml),
    proofTags: Array.isArray(d.proofTags) ? d.proofTags.map((t: unknown) => str(t)) : [],
    workInProgress: bool(d.workInProgress),
    published: bool(d.published),
    heroImageUrl: str(d.heroImageUrl),
    heroImageAlt: str(d.heroImageAlt),
  };
}

function mapTestimonial(doc: Doc): Testimonial {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    quote: str(d.quote),
    clientName: str(d.clientName),
    clientRole: str(d.clientRole),
    category: str(d.category),
    published: bool(d.published),
  };
}

function mapTeam(doc: Doc): TeamMember {
  const d = doc.data() ?? {};
  return {
    id: doc.id,
    name: str(d.name),
    role: str(d.role),
    bio: str(d.bio),
    photoUrl: str(d.photoUrl),
    photoAlt: str(d.photoAlt),
    order: typeof d.order === "number" ? d.order : 0,
  };
}

/* ----------------------------- Blog posts ------------------------------ */

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const snap = await getAdminDb()
    .collection(COLLECTIONS.blog)
    .where("published", "==", true)
    .orderBy("publishDate", "desc")
    .get();
  return snap.docs.map(mapBlog);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const snap = await getAdminDb().collection(COLLECTIONS.blog).where("slug", "==", slug).limit(1).get();
  return snap.empty ? null : mapBlog(snap.docs[0]);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const snap = await getAdminDb().collection(COLLECTIONS.blog).orderBy("publishDate", "desc").get();
  return snap.docs.map(mapBlog);
}

/* ----------------------------- Case studies ---------------------------- */

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  const snap = await getAdminDb()
    .collection(COLLECTIONS.caseStudies)
    .where("published", "==", true)
    .get();
  return snap.docs.map(mapCaseStudy);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const snap = await getAdminDb()
    .collection(COLLECTIONS.caseStudies)
    .where("slug", "==", slug)
    .limit(1)
    .get();
  return snap.empty ? null : mapCaseStudy(snap.docs[0]);
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const snap = await getAdminDb().collection(COLLECTIONS.caseStudies).get();
  return snap.docs.map(mapCaseStudy);
}

/* ----------------------------- Testimonials ---------------------------- */

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const snap = await getAdminDb()
    .collection(COLLECTIONS.testimonials)
    .where("published", "==", true)
    .get();
  return snap.docs.map(mapTestimonial);
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const snap = await getAdminDb().collection(COLLECTIONS.testimonials).get();
  return snap.docs.map(mapTestimonial);
}

/* ------------------------------ Team ----------------------------------- */

export async function getTeamMembers(): Promise<TeamMember[]> {
  const snap = await getAdminDb().collection(COLLECTIONS.team).orderBy("order", "asc").get();
  return snap.docs.map(mapTeam);
}

/* ------------------------- Get-by-id (admin edit) ---------------------- */

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const doc = await getAdminDb().collection(COLLECTIONS.blog).doc(id).get();
  return doc.exists ? mapBlog(doc) : null;
}

export async function getCaseStudyById(id: string): Promise<CaseStudy | null> {
  const doc = await getAdminDb().collection(COLLECTIONS.caseStudies).doc(id).get();
  return doc.exists ? mapCaseStudy(doc) : null;
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const doc = await getAdminDb().collection(COLLECTIONS.testimonials).doc(id).get();
  return doc.exists ? mapTestimonial(doc) : null;
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const doc = await getAdminDb().collection(COLLECTIONS.team).doc(id).get();
  return doc.exists ? mapTeam(doc) : null;
}

/* --------------------------- Generic helpers --------------------------- */

export { COLLECTIONS };
