import Link from "next/link";
import { getAllTestimonials } from "@/lib/data";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialList() {
  const testimonials = await getAllTestimonials().catch(() => []);

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Testimonials</h1>
        <Link className="button" href="/admin/testimonials/new">
          New testimonial <span aria-hidden="true">＋</span>
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className={styles.empty}>No testimonials yet. Create your first one.</div>
      ) : (
        <div className={styles.list}>
          {testimonials.map((t) => (
            <div className={styles.row} key={t.id}>
              <div className={styles.rowMain}>
                <strong>&ldquo;{truncate(t.quote)}&rdquo;</strong>
                <span className={styles.rowMeta}>
                  {[t.clientName, t.clientRole, t.category].filter(Boolean).join(" · ") || "no attribution"}
                </span>
              </div>
              <span className={`${styles.badge} ${t.published ? styles.published : styles.draft}`}>
                {t.published ? "Published" : "Draft"}
              </span>
              <Link className={styles.ghost} href={`/admin/testimonials/${t.id}`}>
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function truncate(s: string, n = 70): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}
