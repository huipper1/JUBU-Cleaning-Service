"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function toggleAreaActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.serviceArea.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle area"
    };
  }
}

export async function updateAreaAction(
  id: string,
  data: {
    name: string;
    lat?: number;
    lng?: number;
    order: number;
    isActive: boolean;
  }
) {
  try {
    await prisma.serviceArea.update({
      where: { id },
      data: {
        name: data.name,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
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
      error: err instanceof Error ? err.message : "Failed to update area"
    };
  }
}
