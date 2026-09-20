/** Shared content types stored in Firestore. Dates are ISO strings on the client. */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  category: string;
  /** ISO date string, e.g. "2026-09-13" */
  publishDate: string;
  published: boolean;
  featuredImageUrl: string;
  featuredImageAlt: string;
  /** SEO overrides. Fall back to title/excerpt when blank. */
  metaTitle?: string;
  metaDescription?: string;
  /** ISO datetime string set from the Firestore server timestamp. */
  updatedAt?: string;
}

export interface CaseStudy {
  id: string;
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
  /** SEO overrides. Fall back to title/summary when blank. */
  metaTitle?: string;
  metaDescription?: string;
  /** ISO datetime string set from the Firestore server timestamp. */
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  clientName: string;
  clientRole: string;
  category: string;
  published: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  photoAlt: string;
  order: number;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  description: string;
  customers: string;
  marketing: string[];
  website: string;
  help: string;
  viewed: boolean;
  /** ISO date string */
  createdAt: string;
}

export type ContentType = "blog" | "case-studies" | "testimonials" | "team";

/** Fixed image aspect ratios enforced by the admin crop widget. */
export const IMAGE_RATIOS = {
  team: 3 / 4, // portrait
  blog: 16 / 9, // widescreen featured image
  caseStudy: 3 / 2, // case-study hero
} as const;
