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
    revalidatePath("/about");
    revalidatePath("/admin/content/team");
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
        photoAlt: `${data.name} - ${data.role} at JUBU Cleaning Service`,
        order: data.order,
        isActive: data.isActive
      }
    });
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/content/team");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update team member"
    };
  }
}

export async function createTeamMemberAction(data: {
  name: string;
  role: string;
  bio?: string;
  photoSrc?: string;
  order?: number;
  isActive?: boolean;
}) {
  try {
    const member = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio ?? null,
        photoSrc: data.photoSrc || "/images/placeholder/team-1.png",
        photoAlt: `${data.name} - ${data.role} at JUBU Cleaning Service`,
        order: data.order ?? 0,
        isActive: data.isActive ?? true
      }
    });
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/content/team");
    return {
      success: true,
      member: {
        id: member.id,
        name: member.name,
        role: member.role,
        bio: member.bio ?? undefined,
        photoSrc: member.photoSrc,
        photoAlt: member.photoAlt,
        order: member.order,
        isActive: member.isActive
      }
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create team member"
    };
  }
}

export async function deleteTeamMemberAction(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id }
    });
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admin/content/team");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete team member"
    };
  }
}
