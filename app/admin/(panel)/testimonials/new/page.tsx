import { TestimonialForm } from "@/components/admin/TestimonialForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewTestimonial() {
  return (
    <>
      <div className={styles.pageHead}>
        <h1>New testimonial</h1>
      </div>
      <TestimonialForm />
    </>
  );
}
