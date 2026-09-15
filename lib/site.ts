/**
 * Site-wide constants and SEO copy.
 * The page title/description strings are lifted verbatim from the approved
 * wireframe's `pageMeta` object — do not reword without client sign-off.
 */

export const SITE_NAME = "Cold Open Lab";

export const SITE_DESCRIPTION =
  "Complete brand, marketing and communications support for B2B, consumer and lifestyle businesses. Messaging, content, PR, email and campaigns managed together.";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

/** Titles + descriptions per route, from the wireframe's pageMeta. */
export const PAGE_META = {
  home: {
    title: "Brand & Marketing Communications Agency | Cold Open Lab",
    description:
      "Complete brand, marketing and communications support for B2B, consumer and lifestyle businesses. Messaging, content, PR, email and campaigns managed together.",
  },
  services: {
    title: "Brand, Marketing & Communications Services | Cold Open Lab",
    description:
      "Get brand messaging, campaign strategy, website copy, social media, blogs, PR, email and customer marketing managed together. Book a discovery call.",
  },
  about: {
    title: "Meet the Icebreakers | About Cold Open Lab",
    description:
      "Meet the people behind Cold Open Lab and explore our approach to brand, marketing and communications for B2B, consumer and lifestyle businesses.",
  },
  blog: {
    title: "Marketing & Communications Insights | Cold Open Lab",
    description:
      "Practical ideas on brand messaging, customer relationships, content marketing and campaign planning for business owners and marketing teams.",
  },
  caseStudies: {
    title: "Case Studies | Cold Open Lab",
    description:
      "See how Cold Open Lab shapes brand, marketing and communications work for B2B, consumer and lifestyle businesses.",
  },
  contact: {
    title: "Book a Discovery Call | Cold Open Lab",
    description:
      "Tell Cold Open Lab about your business, audience and marketing needs, then choose a discovery-call time.",
  },
  privacy: {
    title: "Privacy Notice | Cold Open Lab",
    description: "How Cold Open Lab handles the information you share with us.",
  },
} as const;

/** Public navigation — real routes, no hash links. */
export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

// Contact details confirmed by client 2026-09-15.
export const CONTACT = {
  email: "coldopenlab@gmail.com",
  phone: "+234 815 950 3211",
  address: "Lagos, Nigeria",
  socials: [
    { label: "Instagram", href: "https://instagram.com/coldopenlab_" },
    { label: "X", href: "https://x.com/coldopenlab" },
    { label: "Facebook", href: "https://www.facebook.com/share/1Mi3BNiSTG/?mibextid=wwXIfr" },
    { label: "LinkedIn", href: "https://linkedin.com/company/cold-open-lab" },
  ] as { label: string; href: string }[],
};
