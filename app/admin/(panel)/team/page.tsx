import Link from "next/link";
import { getTeamMembers } from "@/lib/data";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminTeamList() {
  const team = await getTeamMembers().catch(() => []);

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Team members</h1>
        <Link className="button" href="/admin/team/new">
          New member <span aria-hidden="true">＋</span>
        </Link>
      </div>

      {team.length === 0 ? (
        <div className={styles.empty}>No team members yet. Create your first one.</div>
      ) : (
        <div className={styles.list}>
          {team.map((m) => (
            <div className={styles.row} key={m.id}>
              <div className={styles.rowMain}>
                <strong>{m.name || "(unnamed)"}</strong>
                <span className={styles.rowMeta}>
                  {m.role} · order {m.order}
                  {m.photoUrl ? " · photo set" : " · no photo"}
                </span>
              </div>
              <Link className={styles.ghost} href={`/admin/team/${m.id}`}>
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
