"use server";

import { revalidatePath } from "next/cache";

import slugify from "@sindresorhus/slugify";

import { prisma } from "@/lib/db/prisma";

export interface ServiceFormData {
  title: string;
  slug?: string;
  shortDescription: string;
  longDescription?: string;
  icon: string;
  imageSrc: string;
  imageAlt: string;
  basePrice?: number;
  order: number;
  isActive: boolean;
}

export async function createServiceAction(data: ServiceFormData) {
  try {
    const slug = data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.title);

    const existing = await prisma.service.findUnique({
      where: { slug }
    });

    if (existing) {
      return {
        success: false,
        error: `A service with slug "${slug}" already exists. Please choose a different title or slug.`
      };
    }

    const service = await prisma.service.create({
      data: {
        title: data.title.trim(),
        slug,
        shortDescription: data.shortDescription.trim(),
        longDescription: data.longDescription?.trim() || null,
        icon: data.icon || "Sparkles",
        imageSrc: data.imageSrc,
        imageAlt: data.imageAlt || data.title,
        basePrice:
          data.basePrice !== undefined && !isNaN(Number(data.basePrice))
            ? Number(data.basePrice)
            : 199,
        order: data.order ?? 0,
        isActive: data.isActive ?? true
      }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/services");
    revalidatePath("/admin/content/services-list");

    return { success: true, service };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create service"
    };
  }
}

export async function updateServiceAction(id: string, data: ServiceFormData) {
  try {
    const slug = data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.title);

    const existingWithSlug = await prisma.service.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (existingWithSlug) {
      return {
        success: false,
        error: `Another service with slug "${slug}" already exists.`
      };
    }

    await prisma.service.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        shortDescription: data.shortDescription.trim(),
        longDescription: data.longDescription?.trim() || null,
        icon: data.icon || "Sparkles",
        imageSrc: data.imageSrc,
        imageAlt: data.imageAlt || data.title,
        basePrice:
          data.basePrice !== undefined && !isNaN(Number(data.basePrice))
            ? Number(data.basePrice)
            : 199,
        order: data.order ?? 0,
        isActive: data.isActive ?? true
      }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/services");
    revalidatePath("/admin/content/services-list");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update service"
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
    revalidatePath("/admin/content/services");
    revalidatePath("/admin/content/services-list");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle service status"
    };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      return { success: false, error: "Service not found." };
    }

    // 1. Check if selected on homepage
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { homepageServiceIds: true }
    });

    if (settings?.homepageServiceIds?.includes(id)) {
      return {
        success: false,
        error: `Cannot delete "${service.title}" because it is currently selected on the Homepage Services Section. Please remove it from the Homepage Services Section first.`
      };
    }

    // 2. Check if selected on any Area Landing Page
    const activeAreas = await prisma.areaLandingPage.findMany({
      where: {
        serviceIds: {
          has: id
        }
      },
      select: { areaName: true }
    });

    if (activeAreas.length > 0) {
      const areaNames = activeAreas.map((a) => a.areaName).join(", ");
      return {
        success: false,
        error: `Cannot delete "${service.title}" because it is currently assigned to area landing page(s): ${areaNames}. Please deselect it from those areas first.`
      };
    }

    // 3. Check if referenced in GalleryItems
    const galleryCount = await prisma.galleryItem.count({
      where: { serviceId: id }
    });

    if (galleryCount > 0) {
      return {
        success: false,
        error: `Cannot delete "${service.title}" because ${galleryCount} gallery portfolio project(s) are linked to it. Please reassign or delete those gallery items first.`
      };
    }

    await prisma.service.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    revalidatePath("/admin/content/services");
    revalidatePath("/admin/content/services-list");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete service"
    };
  }
}
