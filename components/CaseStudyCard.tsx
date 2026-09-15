import Link from "next/link";
import type { CaseStudy } from "@/lib/types";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="case-card">
      <p className="eyebrow">{study.clientCategory}</p>
      <h3>{study.title}</h3>
      <p>{study.summary}</p>
      {study.proofTags.length > 0 && (
        <p className="proof-caption">{study.proofTags.join(" · ")}</p>
      )}
      {study.workInProgress && <p className="case-status">Work in progress</p>}
      <Link className="text-link" href={`/case-studies/${study.slug}`}>
        Read more <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
