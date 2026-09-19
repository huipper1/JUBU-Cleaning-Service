import type { SiteSettings } from "@/types/content";

// DUMMY: Mock site settings based on design mockups
export const mockSettingsData: SiteSettings = {
  businessName: "JUBU Cleaning Service", // DUMMY
  tagline: "Cleaner Spaces • Brighter Lives", // DUMMY
  badgeText: "Professional Cleaning Services in Dubai", // DUMMY
  logo: {
    src: "/images/logo.png",
    alt: "JUBU Cleaning Services Logo",
    width: 240,
    height: 80
  },
  phone: "+971 50 123 4567", // DUMMY
  phoneDisplay: "+971 50 123 4567", // DUMMY
  phoneTel: "+971501234567", // DUMMY
  whatsapp: "+971 50 123 4567", // DUMMY
  whatsappNumber: "971501234567", // DUMMY
  whatsappDefaultMessage:
    "Hello JUBU Cleaning Service, I would like to inquire about your cleaning services in Dubai.", // DUMMY
  email: "info@jubucleaning.ae", // DUMMY
  address: "Dubai, UAE", // DUMMY
  mapUrl: "https://maps.google.com/?q=Dubai,+United+Arab+Emirates", // DUMMY
  workingHours: "Sat to Thu, 8:00 AM - 8:00 PM", // DUMMY
  socialLinks: [
    { platform: "Facebook", url: "https://facebook.com/jubucleaning", icon: "facebook" }, // DUMMY
    { platform: "Instagram", url: "https://instagram.com/jubucleaning", icon: "instagram" }, // DUMMY
    { platform: "WhatsApp", url: "https://wa.me/971501234567", icon: "whatsapp" }, // DUMMY
    { platform: "YouTube", url: "https://youtube.com/@jubucleaning", icon: "youtube" } // DUMMY
  ],
  defaultSeo: {
    title: "JUBU Cleaning Service | Dubai Cleaning Services", // DUMMY
    description:
      "JUBU Cleaning Service provides reliable, professional and affordable cleaning solutions for homes, offices, villas and commercial spaces in Dubai.", // DUMMY
    ogImage: "/images/placeholder/og-image.svg" // DUMMY
  },
  copyrightText: "© 2026 JUBU Cleaning Service. All rights reserved." // DUMMY
};
