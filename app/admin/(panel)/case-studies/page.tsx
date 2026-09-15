import Link from "next/link";
import { getAllCaseStudies } from "@/lib/data";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudyList() {
  const studies = await getAllCaseStudies().catch(() => []);

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Case studies</h1>
        <Link className="button" href="/admin/case-studies/new">
          New case study <span aria-hidden="true">＋</span>
        </Link>
      </div>

      {studies.length === 0 ? (
        <div className={styles.empty}>No case studies yet. Create your first one.</div>
      ) : (
        <div className={styles.list}>
          {studies.map((study) => (
            <div className={styles.row} key={study.id}>
              <div className={styles.rowMain}>
                <strong>{study.title || "(untitled)"}</strong>
                <span className={styles.rowMeta}>
                  {study.clientCategory ? `${study.clientCategory} · ` : ""}
                  /case-studies/{study.slug}
                  {study.workInProgress ? " · Work in progress" : ""}
                </span>
              </div>
              <span className={`${styles.badge} ${study.published ? styles.published : styles.draft}`}>
                {study.published ? "Published" : "Draft"}
              </span>
              <Link className={styles.ghost} href={`/admin/case-studies/${study.id}`}>
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
