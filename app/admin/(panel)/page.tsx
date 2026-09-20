import Link from "next/link";
import { getAllEnquiries } from "@/lib/data";
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
  const enquiries = await count(getAllEnquiries);
  const wordpressAdminUrl = process.env.WORDPRESS_ADMIN_URL;
  const wordpressConfigured = Boolean(process.env.WORDPRESS_GRAPHQL_URL && wordpressAdminUrl);

  const label = (n: number | null, noun: string, plural = `${noun}s`) =>
    n === null ? "Connect Firebase to manage" : `${n} ${n === 1 ? noun : plural}`;

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Dashboard</h1>
      </div>
      {enquiries === null && (
        <div className={styles.empty} style={{ marginBottom: 24, textAlign: "left" }}>
          <strong>Firebase isn&rsquo;t connected yet.</strong>
          <p style={{ margin: "8px 0 0" }}>
            Add your Firebase keys to <code>.env.local</code> (see the README) to start managing
            enquiries.
          </p>
        </div>
      )}
      {!wordpressConfigured && (
        <div className={styles.empty} style={{ marginBottom: 24, textAlign: "left" }}>
          <strong>WordPress isn&rsquo;t connected yet.</strong>
          <p style={{ margin: "8px 0 0" }}>
            Add <code>WORDPRESS_GRAPHQL_URL</code> and <code>WORDPRESS_ADMIN_URL</code> to{" "}
            <code>.env.local</code> (see the README) to pull in blog posts, case studies,
            testimonials and team members.
          </p>
        </div>
      )}
      <div className={styles.cards}>
        <Link href="/admin/enquiries" className={styles.card}>
          <h2>Enquiries</h2>
          <p>{label(enquiries, "enquiry", "enquiries")}</p>
        </Link>
        {wordpressConfigured ? (
          <a href={wordpressAdminUrl} target="_blank" rel="noreferrer" className={styles.card}>
            <h2>Content (WordPress)</h2>
            <p>Manage blog posts, case studies, testimonials, and team members in WordPress.</p>
          </a>
        ) : (
          <div className={styles.card} style={{ opacity: 0.6 }}>
            <h2>Content (WordPress)</h2>
            <p>Not connected yet.</p>
          </div>
        )}
      </div>
    </>
  );
}
