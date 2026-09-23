import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
import styles from "../admin.module.css";

// Real session verification (Admin SDK) happens here, on every admin request.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.brand}>
          Cold Open Lab<i aria-hidden="true" />
        </Link>
        <AdminNav />
        <span className={styles.spacer} />
        <Link href="/" className={styles.viewSite} target="_blank">
          View site ↗︎
        </Link>
        <LogoutButton />
      </header>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
