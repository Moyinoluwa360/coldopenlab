"use server";

import { revalidatePath } from "next/cache";
import { getAdminDb } from "./firebase-admin";
import { requireAdmin } from "./auth";
import { COLLECTIONS } from "./data";

/**
 * Admin mutations. Blog posts, case studies, testimonials and team members
 * are now edited in WordPress (see README) — the only remaining mutation
 * here is marking a contact-form enquiry as viewed.
 */

export async function markEnquiryViewed(id: string) {
  await requireAdmin();
  await getAdminDb().collection(COLLECTIONS.enquiries).doc(id).set({ viewed: true }, { merge: true });
  revalidatePath("/admin/enquiries");
}
