import Link from "next/link";
import type { Metadata } from "next";
import { content } from "@/lib/content";
import { PAGE_META } from "@/lib/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: { absolute: PAGE_META.blog.title },
  description: PAGE_META.blog.description,
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await content.blogPosts();

  return (
    <>
      <section className="section section--hero">
        <div className="container">
          <p className="eyebrow">The Cold Open Lab blog</p>
          <h1>Useful thinking for the business you&rsquo;re running.</h1>
          <p className="lead">
            Explore customer questions, campaign decisions and the communications problems that turn
            up as a business grows. Find examples and ideas you can use to decide what needs
            attention next.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div className="article-grid">
              {posts.map((post) => (
                <article className="article-card" key={post.id}>
                  {post.category && <span className="eyebrow">{post.category}</span>}
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  {post.publishDate && (
                    <p className="small muted">{formatDate(post.publishDate)}</p>
                  )}
                  <Link className="text-link" href={`/blog/${post.slug}`}>
                    Read article <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Articles are on the way.</h2>
              <p>
                We&rsquo;re preparing the first set of articles. In the meantime, book a discovery
                call to talk through your messaging and content.
              </p>
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
