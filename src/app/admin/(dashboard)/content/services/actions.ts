"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export async function updateHomepageServicesAction(serviceIds: string[]) {
  try {
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: { homepageServiceIds: serviceIds }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/services");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update homepage services"
    };
  }
}

export async function toggleServiceActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.service.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle service"
    };
  }
}

export async function updateServiceAction(
  id: string,
  data: {
    title: string;
    shortDescription: string;
    longDescription?: string;
    order: number;
    isActive: boolean;
  }
) {
  try {
    await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription ?? null,
        order: data.order,
        isActive: data.isActive
      }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update service"
    };
  }
}
