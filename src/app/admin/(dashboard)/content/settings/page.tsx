import { prisma } from "@/lib/db/prisma";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" }
  });

  const initialSettings = {
    businessName: settings?.businessName ?? "JUBU Cleaning Service",
    tagline: settings?.tagline ?? "Cleaner Spaces, Brighter Lives",
    badgeText: settings?.badgeText ?? "Licensed Cleaning Services in Dubai",
    phone: settings?.phone ?? "+971 54 299 5191",
    phoneDisplay: settings?.phoneDisplay ?? "+971 54 299 5191",
    phoneTel: settings?.phoneTel ?? "+971542995191",
    whatsapp: settings?.whatsapp ?? "+971 54 299 5191",
    whatsappNumber: settings?.whatsappNumber ?? "971542995191",
    whatsappDefaultMessage:
      settings?.whatsappDefaultMessage ??
      "Hello JUBU Cleaning Service, I would like to inquire about a free quote for your cleaning services in Dubai.",
    email: settings?.email ?? "sajibulislam679@gmail.com",
    address:
      settings?.address ??
      "Setadel Building, Office # 201, Al Quoz-4, Dubai, United Arab Emirates",
    mapUrl:
      settings?.mapUrl ??
      "https://www.google.com/maps/search/?api=1&query=Setadel+Building+Al+Quoz+4+Dubai",
    workingHours: settings?.workingHours ?? "Sat to Thu, 8:00 AM - 8:00 PM",
    seoTitle:
      settings?.seoTitle ??
      "JUBU Cleaning Service | Professional Cleaning Company in Dubai",
    seoDescription:
      settings?.seoDescription ??
      "Licensed Dubai cleaning company providing deep cleaning, residential cleaning, office cleaning, and move-in sanitization across Dubai.",
    copyrightText:
      settings?.copyrightText ?? "© 2026 JUBU Cleaning Service LLC. All rights reserved.",
    licenceNumber: settings?.licenceNumber ?? "1026183",
    licenceStructure: settings?.licenceStructure ?? "Limited Liability Company (LLC)",
    licenceAuthority:
      settings?.licenceAuthority ?? "Dubai Department of Economy and Tourism (DET)",
    licenceIssueDate: settings?.licenceIssueDate ?? "25 January 2022"
  };

  return <SettingsClient initialSettings={initialSettings} />;
}
