import { notFound } from "next/navigation";
import { getCaseStudyById } from "@/lib/data";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditCaseStudy({ params }: { params: { id: string } }) {
  const study = await getCaseStudyById(params.id);
  if (!study) notFound();

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Edit case study</h1>
      </div>
      <CaseStudyForm study={study} />
    </>
  );
}
