import { getAllEnquiries } from "@/lib/data";
import { MarkViewedButton } from "@/components/admin/MarkViewedButton";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminEnquiryList() {
  const enquiries = await getAllEnquiries().catch(() => []);

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Enquiries</h1>
      </div>

      {enquiries.length === 0 ? (
        <div className={styles.empty}>No enquiries yet.</div>
      ) : (
        <div className={styles.list}>
          {enquiries.map((e) => (
            <div className={styles.row} key={e.id}>
              <div className={styles.rowMain}>
                <strong>
                  {e.name} — {e.business}
                </strong>
                <span className={styles.rowMeta}>
                  {[e.email, e.phone].filter(Boolean).join(" · ")}
                  {e.createdAt ? ` · ${new Date(e.createdAt).toLocaleString()}` : ""}
                </span>
              </div>
              <span className={`${styles.badge} ${e.viewed ? styles.published : styles.draft}`}>
                {e.viewed ? "Viewed" : "New"}
              </span>
              {!e.viewed && <MarkViewedButton id={e.id} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
