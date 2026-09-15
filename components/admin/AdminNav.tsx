"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../app/admin/admin.module.css";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/case-studies", label: "Case studies" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/team", label: "Team" },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className={styles.nav} aria-label="Admin navigation">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={isActive(l.href) ? styles.active : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
