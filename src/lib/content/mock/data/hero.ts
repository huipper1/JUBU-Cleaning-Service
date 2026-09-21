import type { HeroContent } from "@/types/content";

// Mock hero section content from reference screenshot
export const mockHeroData: HeroContent = {
  badge: "Professional Cleaning Services in Dubai",
  headline: "Turning Houses into Fresh Homes",
  subheadline:
    "Our team of experienced cleaners will leave your property clean and tidy, whether it's a one-off clean or a regular service.",
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
      id: "trusted-insured",
      label: "Trusted & Insured",
      icon: "shield-check"
    },
    {
      id: "professional-staff",
      label: "Professional Staff",
      icon: "users"
    },
    {
      id: "eco-friendly",
      label: "Eco-Friendly Products",
      icon: "leaf"
    }
  ],
  heroImage: {
    src: "/images/placeholder/hero-cleaner.png",
    alt: "JUBU Professional Cleaner in uniform with spray bottle and cloth",
    width: 900,
    height: 1000
  },
  floatingBadge: "Cleaner Spaces Brighter Lives"
};
