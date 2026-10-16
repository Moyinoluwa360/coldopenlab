import Image from "next/image";
import styles from "./AuthorByline.module.css";

type Props = { name: string; avatarUrl: string; className?: string };

export function AuthorByline({ name, avatarUrl, className }: Props) {
  if (!name) return null;
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={[styles.byline, className].filter(Boolean).join(" ")}>
      {avatarUrl ? (
        <Image className={styles.avatar} src={avatarUrl} alt="" width={40} height={40} unoptimized />
      ) : (
        <span className={styles.initials} aria-hidden="true">{initials}</span>
      )}
      <span className={styles.name}>{name}</span>
    </div>
  );
}
