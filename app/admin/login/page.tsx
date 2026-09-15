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
    <div className={styles.main} style={{ maxWidth: 440, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Cold Open Lab admin</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Sign in to manage blog posts, case studies, testimonials and team members.
      </p>
      <LoginForm from={safeFrom(searchParams.from)} />
    </div>
  );
}

// Only allow internal redirect targets.
function safeFrom(from?: string): string {
  if (from && from.startsWith("/admin") && !from.startsWith("//")) return from;
  return "/admin";
}
