"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface CreateAreaLandingPageInput {
  areaName: string;
  slug: string;
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

export async function createAreaLandingPageAction(input: CreateAreaLandingPageInput) {
  try {
    const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

    // Validation
    if (!input.areaName.trim()) throw new Error("Area name is required.");
    if (!slug) throw new Error("A valid URL slug is required.");
    if (!input.metaTitle.trim()) throw new Error("Meta Title is required.");
    if (!input.metaDescription.trim()) throw new Error("Meta Description is required.");
    if (!input.heroHeadline.trim()) throw new Error("Hero Headline is required.");
    if (!input.heroIntro.trim()) throw new Error("Hero Intro is required.");
    if (!input.servicesSectionTitle.trim()) throw new Error("Services Section Title is required.");
    if (!input.servicesList || input.servicesList.length === 0) throw new Error("At least one service bullet point is required.");
    if (!input.featuredBlockTitle.trim()) throw new Error("Featured Block Title is required.");
    if (!input.nearYouTitle.trim()) throw new Error("Near You Title is required.");
    if (!input.nearYouText.trim()) throw new Error("Near You Text is required.");
    if (!input.finalCtaTitle.trim()) throw new Error("Final CTA Title is required.");
    if (!input.faqs || input.faqs.length === 0) throw new Error("At least one FAQ item is required.");

    // Check duplicate
    const existing = await prisma.areaLandingPage.findUnique({
      where: { slug }
    });
    if (existing) {
      throw new Error(`An area landing page with slug '/${slug}' already exists.`);
    }

    await prisma.areaLandingPage.create({
      data: {
        id: slug,
        slug,
        areaName: input.areaName.trim(),
        metaTitle: input.metaTitle.trim(),
        metaDescription: input.metaDescription.trim(),
        heroHeadline: input.heroHeadline.trim(),
        heroIntro: input.heroIntro.trim(),
        heroImageSrc: input.heroImageSrc || null,
        heroImageAlt: input.heroImageAlt || (input.heroImageSrc ? `${input.heroHeadline} in Dubai` : null),
        heroImageWidth: input.heroImageSrc ? 800 : null,
        heroImageHeight: input.heroImageSrc ? 600 : null,
        servicesSectionTitle: input.servicesSectionTitle.trim(),
        servicesList: input.servicesList,
        featuredBlockTitle: input.featuredBlockTitle.trim(),
        featuredBlockText: input.featuredBlockText as unknown as Prisma.InputJsonValue,
        nearYouTitle: input.nearYouTitle.trim(),
        nearYouText: input.nearYouText.trim(),
        finalCtaTitle: input.finalCtaTitle.trim(),
        faqs: input.faqs as unknown as Prisma.InputJsonValue,
        isActive: input.isActive
      }
    });

    revalidatePath(`/${slug}`);
    revalidatePath("/[area]", "page");
    revalidatePath("/");
    revalidatePath("/admin/content/landing-pages");

    return { success: true, slug };
  } catch (err: unknown) {
    console.error("Failed to create area landing page:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create area landing page"
    };
  }
}
