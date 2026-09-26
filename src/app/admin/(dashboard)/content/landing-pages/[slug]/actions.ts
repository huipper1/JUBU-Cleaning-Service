"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface UpdateAreaLandingPageData {
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroIntro: string;
  heroImageSrc?: string;
  heroImageAlt?: string;
  servicesSectionTitle: string;
  servicesList: string[];
  featuredBlockTitle: string;
  featuredBlockText: string | Array<{ title: string; text: string }>;
  nearYouTitle: string;
  nearYouText: string;
  finalCtaTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  isActive: boolean;
}

export async function updateAreaLandingPageAction(
  slug: string,
  data: UpdateAreaLandingPageData
) {
  try {
    await prisma.areaLandingPage.update({
      where: { slug },
      data: {
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        heroHeadline: data.heroHeadline,
        heroIntro: data.heroIntro,
        heroImageSrc: data.heroImageSrc || null,
        heroImageAlt: data.heroImageAlt || (data.heroImageSrc ? `${data.heroHeadline} in Dubai` : null),
        heroImageWidth: data.heroImageSrc ? 800 : null,
        heroImageHeight: data.heroImageSrc ? 600 : null,
        servicesSectionTitle: data.servicesSectionTitle,
        servicesList: data.servicesList,
        featuredBlockTitle: data.featuredBlockTitle,
        featuredBlockText: data.featuredBlockText as unknown as Prisma.InputJsonValue,
        nearYouTitle: data.nearYouTitle,
        nearYouText: data.nearYouText,
        finalCtaTitle: data.finalCtaTitle,
        faqs: data.faqs as unknown as Prisma.InputJsonValue,
        isActive: data.isActive
      }
    });

    // Instant multi-layer cache revalidation per CMS_PLAN.md
    revalidatePath(`/${slug}`);
    revalidatePath("/[area]", "page");
    revalidatePath("/");
    revalidatePath("/admin/content/landing-pages");

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to update area landing page:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update landing page"
    };
  }
}
