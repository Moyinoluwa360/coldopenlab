"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../app/admin/admin.module.css";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/enquiries", label: "Enquiries" },
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
