"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./Brand";
import { NAV_LINKS } from "@/lib/site";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className={styles.header}>
      <Brand />
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      <nav
        className={`${styles.nav} ${open ? styles.open : ""}`}
        id="navigation"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isCurrent(link.href) ? "page" : undefined}
            className={isCurrent(link.href) ? styles.current : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link className={`button ${styles.cta}`} href="/contact" onClick={() => setOpen(false)}>
          Book a discovery call <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}
