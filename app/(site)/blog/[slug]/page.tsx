import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { RichText } from "@/components/RichText";
import { SITE_NAME, getSiteUrl } from "@/lib/site";
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
      <section className="section section--hero">
        <div className="container">
          {post.category && <p className="eyebrow">{post.category}</p>}
          <h1>{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
          {post.publishDate && (
            <p className="small muted">Published {formatDate(post.publishDate)}</p>
          )}
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
          <hr className={styles.rule} />
          <h2>Make your website useful to the people checking your business.</h2>
          <p>Book a discovery call with Cold Open Lab to discuss your messaging and content.</p>
          <p>
            <Link className="button" href="/contact">
              Book a discovery call <span aria-hidden="true">↗︎</span>
            </Link>
          </p>
          <p>
            <Link className="text-link" href="/blog">
              Back to the blog
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
