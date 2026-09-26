"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function toggleTeamMemberActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.teamMember.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle team member"
    };
  }
}

export async function updateTeamMemberAction(
  id: string,
  data: {
    name: string;
    role: string;
    bio?: string;
    photoSrc: string;
    order: number;
    isActive: boolean;
  }
) {
  try {
    await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio ?? null,
        photoSrc: data.photoSrc,
        order: data.order,
        isActive: data.isActive
      }
    });
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update team member"
    };
  }
}
