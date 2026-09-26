import type { AboutContent } from "@/types/content";

// DRAFT: client to approve
export const mockAboutData: AboutContent = {
  badge: "ABOUT JUBU CLEANING SERVICE",
  heading: "Professional Cleaning in Dubai",
  paragraphs: [
    "JUBU Cleaning Service is a Dubai-based Limited Liability Company (LLC), licensed by the Dubai Department of Economy and Tourism since January 2022. Operating from our office in Al Quoz-4, Dubai, we provide trusted cleaning solutions for residential and commercial spaces across the city.",
    "Our professional team delivers six dedicated cleaning services: Home Cleaning, Office Cleaning, Deep Cleaning, Sofa & Carpet Cleaning, Post Construction Cleaning, and Move In / Move Out Cleaning. Equipped with professional cleaning machines and specialized tools, we serve our 10 service areas across Dubai with reliable quality and free quotes via WhatsApp, phone, or online inquiry."
  ],
  cta: {
    label: "Get a Free Quote",
    href: "#quote"
  },
  highlights: [
    {
      id: "licensed-company",
      title: "Licensed in Dubai",
      description: "Dubai Department of Economy and Tourism licensed LLC since January 2022.",
      icon: "shield-check"
    },
    {
      id: "professional-equipment",
      title: "Professional Equipment",
      description: "Specialized industrial scrubbing, steam, extraction, and vacuum machines.",
      icon: "settings"
    },
    {
      id: "coverage",
      title: "10 Dubai Service Areas",
      description: "Serving Downtown Dubai, Business Bay, Marina, JLT, JBR, Palm Jumeirah and more.",
      icon: "map-pin"
    }
  ],
  taglineBadge: "Licensed & Reliable",
  secondaryBadge: "Dubai-Wide Service",
  images: [
    {
      src: "/images/placeholder/about-cleaner.png", // DUMMY
      alt: "JUBU Cleaning Service team at work in Dubai",
      width: 800,
      height: 600
    },
    {
      src: "/images/placeholder/about-detail.png", // DUMMY
      alt: "Professional surface sanitization",
      width: 600,
      height: 600
    },
    {
      src: "/images/placeholder/about-team.png", // DUMMY
      alt: "JUBU Cleaning Service staff",
      width: 600,
      height: 600
    }
  ],
  equipment: [
    "Wet & Dry Vacuum Cleaner",
    "Floor Scrubber Machine",
    "Single Disc Machine",
    "High Pressure Washer",
    "Carpet / Sofa Extractor Machine",
    "Steam Cleaner",
    "Cleaning Trolley",
    "Mop & Bucket",
    "Window Cleaning Kit",
    "Microfiber Cloths & Brushes",
    "Telescopic Cleaning Pole",
    "Safety Equipment (Gloves, Shoes, Goggles)"
  ]
};
