import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewCaseStudy() {
  return (
    <>
      <div className={styles.pageHead}>
        <h1>New case study</h1>
      </div>
      <CaseStudyForm />
    </>
  );
}
