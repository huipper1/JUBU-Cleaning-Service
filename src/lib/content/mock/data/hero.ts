import type { HeroContent } from "@/types/content";

// Mock hero section content supported by verified client facts
export const mockHeroData: HeroContent = {
  badge: "Professional Cleaning Services in Dubai",
  headline: "Turning Houses into Fresh Homes",
  subheadline:
    "Professional residential and commercial cleaning across Dubai. Operating as a licensed LLC with specialized machines and free quotes.",
  primaryCta: {
    label: "Get a Free Quote",
    href: "#quote"
  },
  secondaryCta: {
    label: "Our Services",
    href: "#services"
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
