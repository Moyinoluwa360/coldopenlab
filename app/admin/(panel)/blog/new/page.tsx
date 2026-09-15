import { BlogForm } from "@/components/admin/BlogForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewBlogPost() {
  return (
    <>
      <div className={styles.pageHead}>
        <h1>New blog post</h1>
      </div>
      <BlogForm />
    </>
  );
}
