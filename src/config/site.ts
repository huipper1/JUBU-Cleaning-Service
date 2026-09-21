import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

// FIXME: Update site branding, theme color, social links, and OG image
export const siteConfig: SiteConfig = {
  name: "JUBU Cleaning Service | Professional Cleaning Company in Dubai",
  description:
    "Licensed Dubai cleaning company providing deep cleaning, residential cleaning, office cleaning, sofa & carpet cleaning, and move-in sanitization across 10 Dubai communities. Free custom quotes via WhatsApp or phone.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "JUBU Cleaning Service LLC",
  locale: "en_AE",
  themeColor: "#0A1E3B",
  keywords: [
    "cleaning services dubai",
    "professional cleaning company dubai",
    "licensed cleaners dubai",
    "home cleaning services dubai",
    "office cleaning dubai",
    "deep cleaning services dubai",
    "villa deep cleaning dubai",
    "carpet extractor cleaning dubai",
    "sofa steam cleaning dubai",
    "move in cleaning dubai",
    "post construction cleaning dubai",
    "downtown dubai cleaning",
    "business bay cleaning",
    "dubai marina cleaning service",
    "jlt cleaning services",
    "palm jumeirah cleaning company"
  ],
  social: {
    twitter: "",
    github: "",
    linkedin: ""
  },
  ogImage: "/images/logo.png"
} as const;
