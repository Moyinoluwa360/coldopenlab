import Link from "next/link";
import styles from "./Brand.module.css";

/** The wordmark: "Cold Open / Lab" with the small blue accent square. */
export function Brand({ className }: { className?: string }) {
  return (
    <Link href="/" className={`${styles.brand} ${className ?? ""}`} aria-label="Cold Open Lab home">
      <span>Cold Open</span>
      <span>
        Lab<i aria-hidden="true" className={styles.dot} />
      </span>
    </Link>
  );
}
