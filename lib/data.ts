import "server-only";

import { getAdminDb } from "./firebase-admin";
import { wpFetch } from "./wordpress";
import type { BlogPost, CaseStudy, Testimonial, TeamMember, Enquiry } from "./types";

/**
 * Server-side data access.
 *
 * Blog posts, case studies, testimonials and team members are edited in
 * WordPress and read here via WPGraphQL (see README for the required plugins
 * and schema). Enquiries (the contact-form leads) still live in Firestore,
 * read through the Admin SDK, and are managed from the admin panel.
 */

const COLLECTIONS = {
  enquiries: "enquiries",
} as const;

/* ------------------------------ WordPress mapping helpers -------------- */

function orUndefined(v: string): string | undefined {
  return v ? v : undefined;
}

interface WpSeo {
  title?: string | null;
  metaDesc?: string | null;
}

interface WpImage {
  featuredImage?: { node?: { sourceUrl?: string | null; altText?: string | null } | null } | null;
}

function imageUrl(img: WpImage): string {
  return img.featuredImage?.node?.sourceUrl ?? "";
}
function imageAlt(img: WpImage): string {
  return img.featuredImage?.node?.altText ?? "";
}

interface WpPost extends WpImage {
  id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  date?: string | null;
  modified?: string | null;
  seo?: WpSeo | null;
  categories?: { nodes?: { name?: string | null }[] | null } | null;
}

function mapBlog(post: WpPost): BlogPost {
  return {
    id: post.id,
    title: post.title ?? "",
    slug: post.slug ?? "",
    excerpt: (post.excerpt ?? "").replace(/<[^>]+>/g, "").trim(),
    bodyHtml: post.content ?? "",
    category: post.categories?.nodes?.[0]?.name ?? "",
    publishDate: post.date ?? "",
    published: true,
    featuredImageUrl: imageUrl(post),
    featuredImageAlt: imageAlt(post),
    metaTitle: orUndefined(post.seo?.title ?? ""),
    metaDescription: orUndefined(post.seo?.metaDesc ?? ""),
    updatedAt: post.modified ?? undefined,
  };
}

interface WpCaseStudy extends WpImage {
  id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  date?: string | null;
  modified?: string | null;
  seo?: WpSeo | null;
  caseStudyFields?: {
    clientCategory?: string | null;
    proofTags?: string | null;
    workInProgress?: boolean | null;
  } | null;
}

function mapCaseStudy(cs: WpCaseStudy): CaseStudy {
  const fields = cs.caseStudyFields;
  return {
    id: cs.id,
    title: cs.title ?? "",
    slug: cs.slug ?? "",
    clientCategory: fields?.clientCategory ?? "",
    summary: (cs.excerpt ?? "").replace(/<[^>]+>/g, "").trim(),
    bodyHtml: cs.content ?? "",
    proofTags: (fields?.proofTags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    workInProgress: Boolean(fields?.workInProgress),
    published: true,
    heroImageUrl: imageUrl(cs),
    heroImageAlt: imageAlt(cs),
    metaTitle: orUndefined(cs.seo?.title ?? ""),
    metaDescription: orUndefined(cs.seo?.metaDesc ?? ""),
    updatedAt: cs.modified ?? undefined,
  };
}

interface WpTestimonial {
  id: string;
  testimonialFields?: {
    quote?: string | null;
    clientName?: string | null;
    clientRole?: string | null;
    category?: string | null;
  } | null;
}

function mapTestimonial(t: WpTestimonial): Testimonial {
  const fields = t.testimonialFields;
  return {
    id: t.id,
    quote: fields?.quote ?? "",
    clientName: fields?.clientName ?? "",
    clientRole: fields?.clientRole ?? "",
    category: fields?.category ?? "",
    published: true,
  };
}

interface WpTeamMember extends WpImage {
  id: string;
  title?: string | null;
  teamMemberFields?: {
    role?: string | null;
    bio?: string | null;
    order?: number | null;
  } | null;
}

function mapTeam(m: WpTeamMember): TeamMember {
  const fields = m.teamMemberFields;
  return {
    id: m.id,
    name: m.title ?? "",
    role: fields?.role ?? "",
    bio: fields?.bio ?? "",
    photoUrl: imageUrl(m),
    photoAlt: imageAlt(m),
    order: typeof fields?.order === "number" ? fields.order : 0,
  };
}

/* ----------------------------- Blog posts ------------------------------ */

const BLOG_FIELDS = `
  id
  title
  slug
  excerpt
  content
  date
  modified
  featuredImage { node { sourceUrl altText } }
  seo { title metaDesc }
  categories { nodes { name } }
`;

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const data = await wpFetch<{ posts: { nodes: WpPost[] } }>(`
    query PublishedPosts {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes { ${BLOG_FIELDS} }
      }
    }
  `);
  return data.posts.nodes.map(mapBlog);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await wpFetch<{ postBy: WpPost | null }>(
    `
      query PostBySlug($slug: String!) {
        postBy(slug: $slug) { ${BLOG_FIELDS} }
      }
    `,
    { slug }
  );
  return data.postBy ? mapBlog(data.postBy) : null;
}

/* ----------------------------- Case studies ---------------------------- */

const CASE_STUDY_FIELDS = `
  id
  title
  slug
  excerpt
  content
  date
  modified
  featuredImage { node { sourceUrl altText } }
  seo { title metaDesc }
  caseStudyFields { clientCategory proofTags workInProgress }
`;

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  const data = await wpFetch<{ caseStudies: { nodes: WpCaseStudy[] } }>(`
    query PublishedCaseStudies {
      caseStudies(first: 100) {
        nodes { ${CASE_STUDY_FIELDS} }
      }
    }
  `);
  return data.caseStudies.nodes.map(mapCaseStudy);
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const data = await wpFetch<{ caseStudy: WpCaseStudy | null }>(
    `
      query CaseStudyBySlug($slug: ID!) {
        caseStudy(id: $slug, idType: SLUG) { ${CASE_STUDY_FIELDS} }
      }
    `,
    { slug }
  );
  return data.caseStudy ? mapCaseStudy(data.caseStudy) : null;
}

/* ----------------------------- Testimonials ---------------------------- */

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const data = await wpFetch<{ testimonials: { nodes: WpTestimonial[] } }>(`
    query PublishedTestimonials {
      testimonials(first: 100) {
        nodes {
          id
          testimonialFields { quote clientName clientRole category }
        }
      }
    }
  `);
  return data.testimonials.nodes.map(mapTestimonial);
}

/* ------------------------------ Team ----------------------------------- */

export async function getTeamMembers(): Promise<TeamMember[]> {
  const data = await wpFetch<{ teamMembers: { nodes: WpTeamMember[] } }>(`
    query TeamMembers {
      teamMembers(first: 100) {
        nodes {
          id
          title
          featuredImage { node { sourceUrl altText } }
          teamMemberFields { role bio order }
        }
      }
    }
  `);
  return data.teamMembers.nodes.map(mapTeam).sort((a, b) => a.order - b.order);
}

/* ------------------------------ Enquiries -------------------------------- */

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function mapEnquiry(doc: FirebaseFirestore.QueryDocumentSnapshot): Enquiry {
  const d = doc.data() ?? {};
  const createdAt = d.createdAt;
  return {
    id: doc.id,
    name: str(d.name),
    email: str(d.email),
    phone: str(d.phone),
    business: str(d.business),
    description: str(d.description),
    customers: str(d.customers),
    marketing: Array.isArray(d.marketing) ? d.marketing.map((t: unknown) => str(t)) : [],
    website: str(d.website),
    help: str(d.help),
    viewed: bool(d.viewed),
    createdAt:
      createdAt && typeof createdAt.toDate === "function"
        ? createdAt.toDate().toISOString()
        : str(createdAt, ""),
  };
}

export async function getAllEnquiries(): Promise<Enquiry[]> {
  const snap = await getAdminDb().collection(COLLECTIONS.enquiries).orderBy("createdAt", "desc").get();
  return snap.docs.map(mapEnquiry);
}

/* --------------------------- Generic helpers --------------------------- */

export { COLLECTIONS };
