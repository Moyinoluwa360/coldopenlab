import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/data";
import { BlogForm } from "@/components/admin/BlogForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditBlogPost({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(params.id);
  if (!post) notFound();

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Edit blog post</h1>
      </div>
      <BlogForm post={post} />
    </>
  );
}
