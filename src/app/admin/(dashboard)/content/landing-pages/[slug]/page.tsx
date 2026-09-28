import { notFound } from "next/navigation";

import { prisma } from "@/lib/db/prisma";

import { AreaLandingPageEditor } from "./AreaLandingPageEditor";

interface AdminAreaLandingPageEditProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminAreaLandingPageEditPage({
  params
}: AdminAreaLandingPageEditProps) {
  const { slug } = await params;

  const [page, services] = await Promise.all([
    prisma.areaLandingPage.findUnique({
      where: { slug }
    }),
    prisma.service.findMany({
      orderBy: { order: "asc" }
    })
  ]);

  if (!page) {
    notFound();
  }

  const serializedPage = {
    id: page.id,
    slug: page.slug,
    areaName: page.areaName,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    heroHeadline: page.heroHeadline,
    heroIntro: page.heroIntro,
    heroImageSrc: page.heroImageSrc ?? undefined,
    heroImageAlt: page.heroImageAlt ?? undefined,
    servicesSectionTitle: page.servicesSectionTitle,
    servicesList: page.servicesList,
    serviceIds: page.serviceIds ?? [],
    featuredBlockTitle: page.featuredBlockTitle,
    featuredBlockText: page.featuredBlockText as string | Array<{ title: string; text: string }>,
    nearYouTitle: page.nearYouTitle,
    nearYouText: page.nearYouText,
    finalCtaTitle: page.finalCtaTitle,
    faqs: (page.faqs as unknown as Array<{ question: string; answer: string }>) ?? [],
    isActive: page.isActive
  };

  const serializedServices = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortDescription: s.shortDescription,
    icon: s.icon,
    imageSrc: s.imageSrc,
    isActive: s.isActive
  }));

  return <AreaLandingPageEditor pageData={serializedPage} availableServices={serializedServices} />;
}
