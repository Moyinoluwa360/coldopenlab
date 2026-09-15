import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { RichText } from "@/components/RichText";
import styles from "./post.module.css";

export const revalidate = 300;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await content.blogPost(params.slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await content.blogPost(params.slug);
  // Drafts are not public: treat unpublished as not found.
  if (!post || !post.published) notFound();

  return (
    <article>
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
              Book a discovery call <span aria-hidden="true">↗</span>
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
