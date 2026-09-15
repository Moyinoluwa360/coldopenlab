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

export type ContentType = "blog" | "case-studies" | "testimonials" | "team";

/** Fixed image aspect ratios enforced by the admin crop widget. */
export const IMAGE_RATIOS = {
  team: 3 / 4, // portrait
  blog: 16 / 9, // widescreen featured image
  caseStudy: 3 / 2, // case-study hero
} as const;
