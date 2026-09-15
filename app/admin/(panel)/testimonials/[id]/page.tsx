import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/data";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditTestimonial({ params }: { params: { id: string } }) {
  const testimonial = await getTestimonialById(params.id);
  if (!testimonial) notFound();

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Edit testimonial</h1>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </>
  );
}
