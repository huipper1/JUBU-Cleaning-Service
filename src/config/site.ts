import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

// FIXME: Update site branding, theme color, social links, and OG image
export const siteConfig: SiteConfig = {
  name: "JUBU Cleaning Service",
  description:
    "Professional, reliable and affordable cleaning solutions for homes, offices, villas and commercial spaces across Dubai.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "JUBU Cleaning Service",
  locale: "en",
  themeColor: "#0A1E3B",
  keywords: [
    "cleaning services dubai",
    "home cleaning dubai",
    "office cleaning dubai",
    "deep cleaning dubai",
    "villa cleaning dubai",
    "sofa cleaning dubai",
    "carpet cleaning dubai",
    "move in cleaning dubai"
  ],
  social: {
    twitter: "",
    github: "",
    linkedin: ""
  },
  ogImage: "/images/placeholder/og-image.svg"
} as const;
