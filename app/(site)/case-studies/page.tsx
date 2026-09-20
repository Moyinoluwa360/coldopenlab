import Link from "next/link";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import { PAGE_META } from "@/lib/site";
import { CaseStudyCard } from "@/components/CaseStudyCard";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.caseStudies.title },
  description: PAGE_META.caseStudies.description,
  alternates: { canonical: "/case-studies" },
};

export const revalidate = 300;

export default async function CaseStudiesPage() {
  const studies = await content.caseStudies();

  return (
    <>
      <section className="section section--hero section--dark">
        <div className="container">
          <p className="eyebrow">Case studies</p>
          <h1>See how the work takes shape.</h1>
          <p className="lead">
            A look at the brand, marketing and communications work we do for B2B, consumer and
            lifestyle businesses.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {studies.length > 0 ? (
            <div className="case-grid">
              {studies.map((study, i) => (
                <CaseStudyCard key={study.id} study={study} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Case studies are coming soon.</h2>
              <p>We&rsquo;re preparing approved work samples to share here.</p>
              <Link className="button" href="/contact">
                Book a discovery call <span aria-hidden="true">↗</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
