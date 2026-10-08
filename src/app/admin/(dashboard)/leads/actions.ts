"use server";

import { revalidatePath } from "next/cache";

import type { LeadStatus } from "@/types/lead";

import { prisma } from "@/lib/db/prisma";

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

export async function updatePaymentStatusAction(
  id: string,
  paymentStatus: "pending" | "paid" | "cash_on_delivery" | "cancelled"
) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { paymentStatus }
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update payment status"
    };
  }
}

export async function moveToTrashAction(id: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to move lead to trash"
    };
  }
}

export async function restoreFromTrashAction(id: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { deletedAt: null }
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to restore lead"
    };
  }
}

export async function permanentDeleteLeadAction(id: string) {
  try {
    await prisma.lead.delete({
      where: { id }
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to permanently delete lead"
    };
  }
}

export async function emptyTrashAction() {
  try {
    const res = await prisma.lead.deleteMany({
      where: { deletedAt: { not: null } }
    });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true, count: res.count };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to empty trash"
    };
  }
}

export async function clearLeadsByDateRangeAction(startDate?: string, endDate?: string) {
  try {
    const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
      }
      if (endDate) {
        where.createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }

    const res = await prisma.lead.deleteMany({ where });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { success: true, count: res.count };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to clear leads by date range"
    };
  }
}
