import { prisma } from "@/lib/db/prisma";

import { AboutClient } from "./AboutClient";
import type { UpdateAboutData } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [about, settings] = await Promise.all([
    prisma.aboutContent.findUnique({
      where: { id: "default" }
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showAbout: true }
    })
  ]);

  const images = (about?.images as Array<{ src: string }>) ?? [];
  const mainImageSrc = images[0]?.src ?? "/images/placeholder/about-cleaner.png";

  const serialized: UpdateAboutData = {
    badge: about?.badge ?? "ABOUT JUBU CLEANING SERVICE",
    heading: about?.heading ?? "Professional Cleaning in Dubai",
    paragraphs: about?.paragraphs ?? [
      "JUBU Cleaning Service is a Dubai-based Limited Liability Company (LLC), licensed by the Dubai Department of Economy and Tourism since January 2022.",
      "Our professional team delivers six dedicated cleaning services across Dubai with reliable quality and free quotes."
    ],
    ctaLabel: about?.ctaLabel ?? "Get a Free Quote",
    ctaHref: about?.ctaHref ?? "#quote",
    taglineBadge: about?.taglineBadge ?? "Licensed & Reliable",
    secondaryBadge: about?.secondaryBadge ?? "Dubai-Wide Service",
    equipment: about?.equipment ?? [
      "Wet & Dry Vacuum Cleaner",
      "Floor Scrubber Machine",
      "Single Disc Machine",
      "High Pressure Washer",
      "Carpet / Sofa Extractor Machine",
      "Steam Cleaner"
    ],
    mainImageSrc
  };

  return (
    <div className="flex flex-col gap-6">
      <AboutClient initialAbout={serialized} initialShowAbout={settings?.showAbout ?? true} />
    </div>
  );
}
