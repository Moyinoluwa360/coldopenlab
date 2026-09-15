import { TeamForm } from "@/components/admin/TeamForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default function NewTeamMember() {
  return (
    <>
      <div className={styles.pageHead}>
        <h1>New team member</h1>
      </div>
      <TeamForm />
    </>
  );
}
