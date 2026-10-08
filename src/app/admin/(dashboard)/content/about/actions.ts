"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export interface UpdateAboutData {
  badge: string;
  heading: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  taglineBadge?: string;
  secondaryBadge?: string;
  equipment: string[];
  mainImageSrc?: string;
}

export async function updateAboutAction(data: UpdateAboutData) {
  try {
    const existing = await prisma.aboutContent.findUnique({
      where: { id: "default" }
    });

    const existingImages =
      (existing?.images as Array<{ src: string; alt: string; width: number; height: number }>) ??
      [];
    const updatedImages = data.mainImageSrc
      ? [
          {
            src: data.mainImageSrc,
            alt: "JUBU Cleaning Service professional cleaner team",
            width: 800,
            height: 600
          },
          ...existingImages.slice(1)
        ]
      : existingImages;

    await prisma.aboutContent.upsert({
      where: { id: "default" },
      update: {
        badge: data.badge,
        heading: data.heading,
        paragraphs: data.paragraphs,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
        taglineBadge: data.taglineBadge ?? null,
        secondaryBadge: data.secondaryBadge ?? null,
        equipment: data.equipment,
        images: updatedImages
      },
      create: {
        id: "default",
        badge: data.badge,
        heading: data.heading,
        paragraphs: data.paragraphs,
        ctaLabel: data.ctaLabel,
        ctaHref: data.ctaHref,
        taglineBadge: data.taglineBadge ?? null,
        secondaryBadge: data.secondaryBadge ?? null,
        equipment: data.equipment,
        images: updatedImages,
        highlights: existing?.highlights ?? []
      }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update About section"
    };
  }
}
