import type { HeroContent } from "@/types/content";

// Mock hero section content supported by verified client facts
export const mockHeroData: HeroContent = {
  badge: "Professional Cleaning Services in Dubai",
  headline: "Professional Cleaning Services in Dubai",
  subheadline:
    "Home, Villa, Office, Deep Cleaning & Post-Construction Cleaning. Reliable service with professional equipment.",
  primaryCta: {
    label: "Get a Free Quote",
    href: "#quote"
  },
  secondaryCta: {
    label: "WhatsApp Us",
    href: "https://wa.me/971542995191"
  },
  trustBadges: [
    {
      id: "licensed-in-dubai",
      label: "Licensed in Dubai",
      icon: "shield-check"
    },
    {
      id: "professional-equipment",
      label: "Professional Equipment",
      icon: "settings"
    },
    {
      id: "reliable-service",
      label: "Reliable Service",
      icon: "users"
    }
  ],
  heroImage: {
    src: "/images/placeholder/hero-cleaner.png", // DUMMY
    alt: "JUBU Professional Cleaner in uniform with spray bottle and cloth",
    width: 900,
    height: 1000
  },
  floatingBadge: "Cleaner Spaces Brighter Lives"
};
