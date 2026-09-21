import type { SiteSettings } from "@/types/content";

export const mockSettingsData: SiteSettings = {
  businessName: "JUBU Cleaning Service",
  tagline: "Cleaner Spaces • Brighter Lives",
  badgeText: "Professional Cleaning Services in Dubai",
  logo: {
    src: "/images/logo.png",
    alt: "JUBU Cleaning Services Logo",
    width: 240,
    height: 80
  },
  phone: "+971 54 299 5191",
  phoneDisplay: "+971 54 299 5191",
  phoneTel: "+971542995191",
  whatsapp: "+880 17 5660 1431",
  whatsappNumber: "8801756601431",
  whatsappDefaultMessage:
    "Hello JUBU Cleaning Service, I would like to inquire about a free quote for your cleaning services in Dubai.",
  email: "sajibulislam679@gmail.com",
  address: "Office No. 95-804, Naif, Dubai, United Arab Emirates",
  // DUMMY: replace with real Maps link
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Office+95-804+Naif+Dubai",
  // DUMMY: confirm with client
  workingHours: "Sat to Thu, 8:00 AM - 8:00 PM",
  socialLinks: [
    {
      platform: "Facebook",
      url: "https://www.facebook.com/share/19bAVeUag4/?mibextid=wwXIfr",
      icon: "facebook"
    },
    {
      platform: "WhatsApp",
      url: "https://wa.me/971542995191",
      icon: "whatsapp"
    }
  ],
  defaultSeo: {
    title: "JUBU Cleaning Service | Dubai Cleaning Services",
    description:
      "JUBU Cleaning Service provides reliable and professional cleaning solutions for homes, offices, villas and commercial spaces in Dubai. Request your free quote today.",
    ogImage: "/images/placeholder/og-image.svg" // DUMMY
  },
  copyrightText: "© 2026 JUBU Cleaning Service. All rights reserved.",
  licence: {
    number: "1026183",
    legalStructure: "Limited Liability Company (LLC)",
    issuingAuthority: "Dubai Department of Economy and Tourism",
    issueDate: "25 January 2022"
  }
};
