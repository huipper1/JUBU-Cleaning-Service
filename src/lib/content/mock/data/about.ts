import type { AboutContent } from "@/types/content";

// DUMMY: Mock about company section content matching design Part 2
export const mockAboutData: AboutContent = {
  badge: "ABOUT JUBU CLEANING SERVICE", // DUMMY
  heading: "More Than Just Cleaning", // DUMMY
  paragraphs: [
    "JUBU Cleaning Service is a Dubai-based cleaning company focused on quality, reliability and customer satisfaction. We provide professional cleaning solutions for homes, offices, villas and commercial spaces across Dubai.", // DUMMY
    "We believe a clean environment creates a healthier, happier lifestyle. That's why we go the extra mile to deliver exceptional service with attention to detail, every time." // DUMMY
  ],
  cta: {
    label: "Learn More", // DUMMY
    href: "#quote"
  },
  highlights: [
    {
      id: "quality-service",
      title: "Quality Service", // DUMMY
      description: "Rigorous attention to detail and proven cleaning protocols.", // DUMMY
      icon: "gem"
    },
    {
      id: "cleaner-environment",
      title: "A Cleaner Environment", // DUMMY
      description: "Non-toxic, family and pet-safe certified detergents.", // DUMMY
      icon: "leaf"
    },
    {
      id: "happier-communities",
      title: "Happier Communities", // DUMMY
      description: "Building trustworthy long-term relationships across Dubai.", // DUMMY
      icon: "users"
    }
  ],
  taglineBadge: "Clean Today Brighter Tomorrow", // DUMMY
  secondaryBadge: "Clean Homes Happy Families", // DUMMY
  images: [
    {
      src: "/images/placeholder/about-team.png", // DUMMY
      alt: "Pristine modern living room cleaned by JUBU specialists in Dubai",
      width: 800,
      height: 600
    },
    {
      src: "/images/placeholder/about-detail.png", // DUMMY
      alt: "Gloved hands sanitizing luxury marble surface",
      width: 600,
      height: 600
    },
    {
      src: "/images/placeholder/about-cleaning.png", // DUMMY
      alt: "JUBU uniformed staff vacuuming luxury rug",
      width: 600,
      height: 600
    }
  ]
};

