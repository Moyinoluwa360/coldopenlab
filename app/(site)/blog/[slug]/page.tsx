import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { RichText } from "@/components/RichText";
import { CALENDLY_URL, SITE_NAME, getSiteUrl } from "@/lib/site";
import styles from "./post.module.css";

export const revalidate = 300;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await content.blogPost(params.slug);
  if (!post) return { title: "Article not found" };
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishDate || undefined,
      modifiedTime: post.updatedAt || undefined,
      images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await content.blogPost(params.slug);
  // Drafts are not public: treat unpublished as not found.
  if (!post || !post.published) notFound();

  const allPosts = await content.blogPosts();
  const morePosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const shareUrl = `${getSiteUrl()}/blog/${post.slug}`;
  const shareText = post.title;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.featuredImageUrl || undefined,
    datePublished: post.publishDate || undefined,
    dateModified: post.updatedAt || post.publishDate || undefined,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="section" style={{ paddingBottom: "var(--space-4)" }}>
        <div className={`container ${styles.headerCol}`}>
          {post.category && <span className={styles.tag}>{post.category}</span>}
          <h1 className={styles.title}>{post.title}</h1>
          <p className={`lead ${styles.lead}`}>{post.excerpt}</p>
          <div className={styles.metaRow}>
            {post.publishDate && (
              <p className="small muted">Published {formatDate(post.publishDate)}</p>
            )}
            <div className={styles.share}>
              <span className="small muted">Share:</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
            </div>
          </div>
        </div>
      </section>

      {post.featuredImageUrl && (
        <div className="section" style={{ paddingTop: 0, paddingBottom: 0, borderBottom: 0 }}>
          <div className={`container ${styles.hero}`}>
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
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
          <RichText className={styles.body} html={post.bodyHtml} />
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>Make your website useful to the people checking your business.</h2>
            <p>Book a discovery call with Cold Open Lab to discuss your messaging and content.</p>
            <Link className="button button--dark" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a discovery call <span aria-hidden="true">↗︎</span>
            </Link>
          </div>
          <p className={styles.backLink}>
            <Link className="text-link" href="/blog">
              ← Back to the blog
            </Link>
          </p>
        </div>
      </section>

      {morePosts.length > 0 && (
        <section className="section" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="container">
            <h2 className={styles.moreHeading}>More from the blog</h2>
            <div className={styles.moreGrid}>
              {morePosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className={styles.moreCard}>
                  <div className={styles.moreMedia}>
                    {p.featuredImageUrl && (
                      <Image
                        src={p.featuredImageUrl}
                        alt={p.featuredImageAlt || p.title}
                        fill
                        sizes="(max-width: 700px) 100vw, 360px"
                      />
                    )}
                  </div>
                  {p.category && <span className="eyebrow">{p.category}</span>}
                  <h3>{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
