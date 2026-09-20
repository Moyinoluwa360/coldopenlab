import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes = ["", "/services", "/about", "/blog", "/case-studies", "/contact", "/privacy"];

  const [posts, studies] = await Promise.all([content.blogPosts(), content.caseStudies()]);

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  for (const post of posts) {
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : post.publishDate
          ? new Date(post.publishDate)
          : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const study of studies) {
    entries.push({
      url: `${base}/case-studies/${study.slug}`,
      lastModified: study.updatedAt ? new Date(study.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
