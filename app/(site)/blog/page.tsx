import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import { CALENDLY_URL, PAGE_META } from "@/lib/site";
import { formatDate } from "@/lib/format";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.blog.title },
  description: PAGE_META.blog.description,
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await content.blogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="section" style={{ paddingBottom: featured ? 0 : undefined }}>
        <div className="container">
          <div className={styles.masthead}>
            <div>
              <p className={styles.mastheadLabel}>Cold Open Lab</p>
              <h1 className={styles.mastheadTitle}>The Blog</h1>
            </div>
            {posts.length > 0 && (
              <p className={styles.mastheadCount}>
                {posts.length} article{posts.length === 1 ? "" : "s"} on messaging, campaigns and
                customer relationships.
              </p>
            )}
          </div>
        </div>
      </section>

      {featured && (
        <section className="section" style={{ paddingTop: "var(--space-5)", borderBottom: 0 }}>
          <div className="container">
            <Link href={`/blog/${featured.slug}`} className={styles.featured}>
              <div className={styles.featuredMedia}>
                {featured.featuredImageUrl && (
                  <Image
                    src={featured.featuredImageUrl}
                    alt={featured.featuredImageAlt || featured.title}
                    fill
                    sizes="(max-width: 760px) 100vw, 44vw"
                    className={styles.featuredImg}
                    priority
                  />
                )}
              </div>
              <div className={styles.featuredBody}>
                {featured.category && <span className={styles.featuredTag}>{featured.category}</span>}
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                <div className={styles.featuredMeta}>
                  <strong>Read article</strong>
                  <span aria-hidden="true">↗︎</span>
                  {featured.publishDate && <span>· {formatDate(featured.publishDate)}</span>}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <>
              {rest.length > 0 && <p className={styles.sectionLabel}>More articles</p>}
              <div className="article-grid">
                {rest.map((post) => (
                  <article className="article-card" key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="article-card-media"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {post.featuredImageUrl && (
                        <Image
                          src={post.featuredImageUrl}
                          alt={post.featuredImageAlt || post.title}
                          fill
                          sizes="(max-width: 700px) 100vw, 560px"
                        />
                      )}
                    </Link>
                    <div className="article-card-body">
                      {post.category && <span className="eyebrow">{post.category}</span>}
                      <h2>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p>{post.excerpt}</p>
                      {post.publishDate && (
                        <p className="small muted">{formatDate(post.publishDate)}</p>
                      )}
                      <Link className="text-link" href={`/blog/${post.slug}`}>
                        Read article <span aria-hidden="true">↗︎</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>Articles are on the way.</h2>
              <p>
                We&rsquo;re preparing the first set of articles. In the meantime, book a discovery
                call to talk through your messaging and content.
              </p>
              <Link className="button" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                Book a discovery call <span aria-hidden="true">↗︎</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
