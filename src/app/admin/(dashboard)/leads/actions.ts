"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import type { LeadStatus } from "@/types/lead";

export async function updateLeadStatusAction(id: string, status: LeadStatus) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update status"
    };
  }
}

export async function updateLeadNotesAction(id: string, adminNotes: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { adminNotes }
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update notes"
    };
  }
}
