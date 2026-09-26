"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function toggleGalleryItemActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.galleryItem.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle gallery item"
    };
  }
}

export async function updateGalleryItemAction(
  id: string,
  data: {
    title: string;
    caption?: string;
    imageSrc: string;
    order: number;
    isActive: boolean;
  }
) {
  try {
    await prisma.galleryItem.update({
      where: { id },
      data: {
        title: data.title,
        caption: data.caption ?? null,
        imageSrc: data.imageSrc,
        order: data.order,
        isActive: data.isActive
      }
    });
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update gallery item"
    };
  }
}
