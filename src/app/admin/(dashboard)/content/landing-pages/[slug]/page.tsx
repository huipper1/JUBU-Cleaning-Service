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

  const page = await prisma.areaLandingPage.findUnique({
    where: { slug }
  });

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
    featuredBlockTitle: page.featuredBlockTitle,
    featuredBlockText: page.featuredBlockText as string | Array<{ title: string; text: string }>,
    nearYouTitle: page.nearYouTitle,
    nearYouText: page.nearYouText,
    finalCtaTitle: page.finalCtaTitle,
    faqs: (page.faqs as unknown as Array<{ question: string; answer: string }>) ?? [],
    isActive: page.isActive
  };

  return <AreaLandingPageEditor pageData={serializedPage} />;
}
