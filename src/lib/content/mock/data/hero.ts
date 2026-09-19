import type { HeroContent } from "@/types/content";

// DUMMY: Mock hero section content from design Part 1
export const mockHeroData: HeroContent = {
  badge: "Professional Cleaning Services in Dubai", // DUMMY
  headline: "A Cleaner Space for a Healthier Life", // DUMMY
  subheadline:
    "JUBU Cleaning Service provides reliable, professional and affordable cleaning solutions for homes, offices, villas and commercial spaces in Dubai.", // DUMMY
  primaryCta: {
    label: "Get a Free Quote", // DUMMY
    href: "#quote"
  },
  secondaryCta: {
    label: "Our Services", // DUMMY
    href: "#services"
  },
  trustBadges: [
    {
      id: "trusted-insured",
      label: "Trusted & Insured", // DUMMY
      icon: "shield-check"
    },
    {
      id: "professional-staff",
      label: "Professional Staff", // DUMMY
      icon: "users"
    },
    {
      id: "eco-friendly",
      label: "Eco-Friendly Products", // DUMMY
      icon: "leaf"
    },
    {
      id: "on-time-service",
      label: "On-Time Service", // DUMMY
      icon: "clock"
    }
  ],
  heroImage: {
    src: "/images/placeholder/hero-cleaner.png", // DUMMY
    alt: "Professional JUBU cleaner wiping window with Burj Khalifa view in Dubai",
    width: 1920,
    height: 1080
  },
  floatingBadge: "Clean Spaces, Happy Faces" // DUMMY
};
