import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { RichText } from "@/components/RichText";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
import styles from "./case.module.css";

export const revalidate = 300;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await content.caseStudy(params.slug);
  if (!study) return { title: "Case study not found" };
  const title = study.metaTitle || study.title;
  const description = study.metaDescription || study.summary;
  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/case-studies/${study.slug}`,
      modifiedTime: study.updatedAt || undefined,
      images: study.heroImageUrl ? [{ url: study.heroImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: study.heroImageUrl ? [study.heroImageUrl] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const study = await content.caseStudy(params.slug);
  if (!study || !study.published) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.metaDescription || study.summary,
    image: study.heroImageUrl || undefined,
    dateModified: study.updatedAt || undefined,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${getSiteUrl()}/case-studies/${study.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="section section--hero">
        <div className="container">
          <p className="eyebrow">{study.clientCategory}</p>
          <h1>{study.title}</h1>
          <p className="lead">{study.summary}</p>
          {study.proofTags.length > 0 && (
            <p className="proof-caption muted">{study.proofTags.join(" · ")}</p>
          )}
          {study.workInProgress && <p className="case-status">Work in progress</p>}
        </div>
      </section>

      {study.heroImageUrl && (
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0, borderBottom: 0 }}>
          <div className={`container ${styles.hero}`}>
            <Image
              src={study.heroImageUrl}
              alt={study.heroImageAlt || study.title}
              fill
              sizes="(max-width: 1180px) 100vw, 1180px"
              className={styles.heroImg}
              priority
            />
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          {study.bodyHtml ? (
            <RichText className={styles.body} html={study.bodyHtml} />
          ) : (
            <p className="muted">The full write-up for this project is coming soon.</p>
          )}
          <hr className={styles.rule} />
          <h2>See how this could work for your business.</h2>
          <p>Book a discovery call to talk through your brand, marketing and communications.</p>
          <p>
            <Link className="button" href="/contact">
              Book a discovery call <span aria-hidden="true">↗</span>
            </Link>
          </p>
          <p>
            <Link className="text-link" href="/case-studies">
              Back to case studies
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
