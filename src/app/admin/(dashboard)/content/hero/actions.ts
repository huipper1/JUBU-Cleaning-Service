"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export interface UpdateHeroData {
  badge: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroImageSrc: string;
  heroImageAlt: string;
  floatingBadge: string;
}

export async function updateHeroAction(data: UpdateHeroData) {
  try {
    await prisma.heroContent.update({
      where: { id: "default" },
      data: {
        badge: data.badge,
        headline: data.headline,
        subheadline: data.subheadline,
        primaryCtaLabel: data.primaryCtaLabel,
        primaryCtaHref: data.primaryCtaHref,
        secondaryCtaLabel: data.secondaryCtaLabel,
        secondaryCtaHref: data.secondaryCtaHref,
        heroImageSrc: data.heroImageSrc,
        heroImageAlt: data.heroImageAlt,
        floatingBadge: data.floatingBadge
      }
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update hero section"
    };
  }
}
