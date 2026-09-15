import "server-only";

import {
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getPublishedCaseStudies,
  getCaseStudyBySlug,
  getPublishedTestimonials,
  getTeamMembers,
} from "./data";
import type { BlogPost, CaseStudy, Testimonial, TeamMember } from "./types";

/**
 * Resilient public content getters. If Firebase is not configured yet (or a
 * read fails), these log a warning and return a safe fallback so public pages
 * render an empty state instead of crashing — and so `next build` succeeds
 * before the client has connected Firebase.
 */

async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[content] ${label} unavailable:`, (err as Error).message);
    return fallback;
  }
}

export const content = {
  blogPosts: () => safe(getPublishedBlogPosts, [] as BlogPost[], "blogPosts"),
  blogPost: (slug: string) => safe(() => getBlogPostBySlug(slug), null, `blogPost:${slug}`),
  caseStudies: () => safe(getPublishedCaseStudies, [] as CaseStudy[], "caseStudies"),
  caseStudy: (slug: string) =>
    safe(() => getCaseStudyBySlug(slug), null, `caseStudy:${slug}`),
  testimonials: () => safe(getPublishedTestimonials, [] as Testimonial[], "testimonials"),
  team: () => safe(getTeamMembers, [] as TeamMember[], "team"),
};
