import Link from "next/link";
import { Brand } from "./Brand";
import { NewsletterForm } from "./NewsletterForm";
import { CONTACT } from "@/lib/site";
import styles from "./Footer.module.css";

const FOOTER_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <Brand className={styles.brand} />
          <p className={styles.about}>
            Cold Open Lab is a brand, marketing and communications agency for B2B businesses and
            consumer and lifestyle brands.
          </p>
          <div className={styles.contact}>
            {CONTACT.address && <p>{CONTACT.address}</p>}
            {CONTACT.phone && (
              <p>
                <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}>{CONTACT.phone}</a>
              </p>
            )}
            {CONTACT.email && (
              <p>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </p>
            )}
            {CONTACT.socials.length > 0 && (
              <div className={styles.socials}>
                {CONTACT.socials.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className={styles.heading}>Ideas worth bringing into your business.</h2>
          <p>
            Get campaign breakdowns, market observations and lessons we&rsquo;re learning through
            our work at Cold Open Lab.
          </p>
          <NewsletterForm />
        </div>
      </div>
      <div className={`container ${styles.links}`}>
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <span>© {new Date().getFullYear()} Cold Open Lab</span>
      </div>
    </footer>
  );
}
