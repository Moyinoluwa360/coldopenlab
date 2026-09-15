import Link from "next/link";
import { getAllBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  const posts = await getAllBlogPosts().catch(() => []);

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Blog posts</h1>
        <Link className="button" href="/admin/blog/new">
          New post <span aria-hidden="true">＋</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className={styles.empty}>No posts yet. Create your first one.</div>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <div className={styles.row} key={post.id}>
              <div className={styles.rowMain}>
                <strong>{post.title || "(untitled)"}</strong>
                <span className={styles.rowMeta}>
                  {post.category ? `${post.category} · ` : ""}
                  {post.publishDate ? formatDate(post.publishDate) : "no date"} · /blog/{post.slug}
                </span>
              </div>
              <span className={`${styles.badge} ${post.published ? styles.published : styles.draft}`}>
                {post.published ? "Published" : "Draft"}
              </span>
              <Link className={styles.ghost} href={`/admin/blog/${post.id}`}>
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
