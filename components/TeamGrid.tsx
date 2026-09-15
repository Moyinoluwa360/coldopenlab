import Image from "next/image";
import type { TeamMember } from "@/lib/types";
import styles from "./TeamGrid.module.css";

export function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) {
    return <p className="muted">Team profiles are being added. Check back soon.</p>;
  }

  return (
    <div className={styles.grid}>
      {members.map((member, i) => (
        <article className={styles.card} key={member.id}>
          <div className={styles.photo}>
            {member.photoUrl ? (
              <Image
                src={member.photoUrl}
                alt={member.photoAlt || `Portrait of ${member.name}, ${member.role}`}
                fill
                sizes="(max-width: 760px) 90vw, 320px"
                className={styles.img}
              />
            ) : (
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
          </div>
          <p className={styles.role}>{member.role}</p>
          <h3 className={styles.name}>{member.name}</h3>
          <p className={styles.bio}>{member.bio}</p>
        </article>
      ))}
    </div>
  );
}
