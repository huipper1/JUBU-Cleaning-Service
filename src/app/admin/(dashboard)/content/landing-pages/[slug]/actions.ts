"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface UpdateAreaLandingPageData {
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroIntro: string;
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

    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to update area landing page:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update landing page"
    };
  }
}
