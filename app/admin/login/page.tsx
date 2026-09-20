import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  // Already signed in → skip the login screen.
  const user = await getAdminUser();
  if (user) redirect(safeFrom(searchParams.from));

  return (
    <div className={styles.loginShell}>
      <div className={styles.loginCard}>
        <span className={styles.brand}>
          Cold Open Lab<i aria-hidden="true" />
        </span>
        <h1 style={{ fontSize: 30, margin: "18px 0 8px", letterSpacing: "-0.03em" }}>Admin sign-in</h1>
        <p className="muted" style={{ marginBottom: 8 }}>
          Manage blog posts, case studies, testimonials, team members and enquiries.
        </p>
        <LoginForm from={safeFrom(searchParams.from)} />
      </div>
    </div>
  );
}

// Only allow internal redirect targets.
function safeFrom(from?: string): string {
  if (from && from.startsWith("/admin") && !from.startsWith("//")) return from;
  return "/admin";
}
