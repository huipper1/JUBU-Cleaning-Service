import { prisma } from "@/lib/db/prisma";
import { HeroClient } from "./HeroClient";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const [hero, settings] = await Promise.all([
    prisma.heroContent.findUnique({
      where: { id: "default" }
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { showHero: true }
    })
  ]);

  const initialHero = {
    badge: hero?.badge ?? "Professional Cleaning Services in Dubai",
    headline: hero?.headline ?? "Professional Cleaning Services in Dubai",
    subheadline:
      hero?.subheadline ??
      "Home, Villa, Office, Deep Cleaning & Post-Construction Cleaning. Reliable service with professional equipment.",
    primaryCtaLabel: hero?.primaryCtaLabel ?? "Get a Free Quote",
    primaryCtaHref: hero?.primaryCtaHref ?? "#quote",
    secondaryCtaLabel: hero?.secondaryCtaLabel ?? "WhatsApp Us",
    secondaryCtaHref: hero?.secondaryCtaHref ?? "https://wa.me/971542995191",
    heroImageSrc: hero?.heroImageSrc ?? "/images/placeholder/hero-cleaner.png",
    heroImageAlt:
      hero?.heroImageAlt ?? "JUBU Professional Cleaner in uniform with spray bottle and cloth",
    floatingBadge: hero?.floatingBadge ?? "Cleaner Spaces Brighter Lives"
  };

  return (
    <HeroClient
      initialHero={initialHero}
      initialShowHero={settings?.showHero ?? true}
    />
  );
}
