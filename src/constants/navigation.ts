import type { AreaNavItem, NavItem } from "@/types/navigation";

export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-choose" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#contact" }
] as const;

export const AREA_NAV_ITEMS: readonly AreaNavItem[] = [
  {
    name: "Business Bay",
    href: "/business-bay",
    subtitle: "Cleaning Services"
  },
  {
    name: "Dubai Marina",
    href: "/dubai-marina",
    subtitle: "Cleaning Services"
  },
  {
    name: "Downtown Dubai",
    href: "/downtown-dubai",
    subtitle: "Cleaning Services"
  },
  {
    name: "Jumeirah",
    href: "/jumeirah",
    subtitle: "Cleaning Services"
  },
  {
    name: "JVC (Jumeirah Village Circle)",
    href: "/jvc",
    subtitle: "Cleaning Services"
  }
] as const;
