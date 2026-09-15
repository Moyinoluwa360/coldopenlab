import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/lib/data";
import { TeamForm } from "@/components/admin/TeamForm";
import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function EditTeamMember({ params }: { params: { id: string } }) {
  const member = await getTeamMemberById(params.id);
  if (!member) notFound();

  return (
    <>
      <div className={styles.pageHead}>
        <h1>Edit team member</h1>
      </div>
      <TeamForm member={member} />
    </>
  );
}
