"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export interface GalleryItemFormData {
  title: string;
  caption?: string;
  serviceId: string;
  imageSrc: string;
  imageAlt?: string;
  beforeImageSrc?: string;
  beforeImageAlt?: string;
  afterImageSrc?: string;
  afterImageAlt?: string;
  isBeforeAfter: boolean;
  order: number;
  isActive: boolean;
}

export async function createGalleryItemAction(data: GalleryItemFormData) {
  try {
    if (!data.title.trim()) {
      return { success: false, error: "Title is required." };
    }
    if (!data.serviceId) {
      return { success: false, error: "Please select an associated service." };
    }
    if (data.isBeforeAfter) {
      if (!data.beforeImageSrc || !data.afterImageSrc) {
        return {
          success: false,
          error: "Both Before and After photos are required for comparison cards."
        };
      }
    } else if (!data.imageSrc) {
      return { success: false, error: "Project photo is required." };
    }

    const mainImageSrc = data.isBeforeAfter ? data.afterImageSrc! : data.imageSrc;

    const item = await prisma.galleryItem.create({
      data: {
        title: data.title.trim(),
        caption: data.caption?.trim() || null,
        serviceId: data.serviceId,
        imageSrc: mainImageSrc,
        imageAlt: data.imageAlt || data.title.trim(),
        beforeImageSrc: data.isBeforeAfter ? data.beforeImageSrc : null,
        beforeImageAlt: data.isBeforeAfter ? data.beforeImageAlt || `${data.title} Before` : null,
        afterImageSrc: data.isBeforeAfter ? data.afterImageSrc : null,
        afterImageAlt: data.isBeforeAfter ? data.afterImageAlt || `${data.title} After` : null,
        isBeforeAfter: data.isBeforeAfter,
        order: data.order ?? 0,
        isActive: data.isActive ?? true
      }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/gallery");

    return { success: true, item };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create gallery item"
    };
  }
}

export async function updateGalleryItemAction(id: string, data: GalleryItemFormData) {
  try {
    if (!data.title.trim()) {
      return { success: false, error: "Title is required." };
    }
    if (data.isBeforeAfter) {
      if (!data.beforeImageSrc || !data.afterImageSrc) {
        return {
          success: false,
          error: "Both Before and After photos are required for comparison cards."
        };
      }
    } else if (!data.imageSrc) {
      return { success: false, error: "Project photo is required." };
    }

    const mainImageSrc = data.isBeforeAfter ? data.afterImageSrc! : data.imageSrc;

    await prisma.galleryItem.update({
      where: { id },
      data: {
        title: data.title.trim(),
        caption: data.caption?.trim() || null,
        serviceId: data.serviceId,
        imageSrc: mainImageSrc,
        imageAlt: data.imageAlt || data.title.trim(),
        beforeImageSrc: data.isBeforeAfter ? data.beforeImageSrc : null,
        beforeImageAlt: data.isBeforeAfter ? data.beforeImageAlt || `${data.title} Before` : null,
        afterImageSrc: data.isBeforeAfter ? data.afterImageSrc : null,
        afterImageAlt: data.isBeforeAfter ? data.afterImageAlt || `${data.title} After` : null,
        isBeforeAfter: data.isBeforeAfter,
        order: data.order,
        isActive: data.isActive
      }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/gallery");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update gallery item"
    };
  }
}

export async function deleteGalleryItemAction(id: string) {
  try {
    await prisma.galleryItem.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/gallery");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete gallery item"
    };
  }
}

export async function toggleGalleryItemActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.galleryItem.update({
      where: { id },
      data: { isActive }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/gallery");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle gallery item"
    };
  }
}
