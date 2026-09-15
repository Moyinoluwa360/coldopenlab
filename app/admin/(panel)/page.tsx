import Link from "next/link";
import {
  getAllBlogPosts,
  getAllCaseStudies,
  getAllTestimonials,
  getTeamMembers,
} from "@/lib/data";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

async function count(fn: () => Promise<unknown[]>): Promise<number | null> {
  try {
    return (await fn()).length;
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const [blog, cases, testimonials, team] = await Promise.all([
    count(getAllBlogPosts),
    count(getAllCaseStudies),
    count(getAllTestimonials),
    count(getTeamMembers),
  ]);

  const label = (n: number | null, noun: string) =>
    n === null ? "Connect Firebase to manage" : `${n} ${noun}${n === 1 ? "" : "s"}`;

  const cards = [
    { href: "/admin/blog", title: "Blog posts", meta: label(blog, "post") },
    { href: "/admin/case-studies", title: "Case studies", meta: label(cases, "study") },
    { href: "/admin/testimonials", title: "Testimonials", meta: label(testimonials, "testimonial") },
    { href: "/admin/team", title: "Team members", meta: label(team, "member") },
  ];

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Dashboard</h1>
      </div>
      {blog === null && (
        <div className={styles.empty} style={{ marginBottom: 24, textAlign: "left" }}>
          <strong>Firebase isn&rsquo;t connected yet.</strong>
          <p style={{ margin: "8px 0 0" }}>
            Add your Firebase keys to <code>.env.local</code> (see the README) to start managing
            content.
          </p>
        </div>
      )}
      <div className={styles.cards}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className={styles.card}>
            <h2>{c.title}</h2>
            <p>{c.meta}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
