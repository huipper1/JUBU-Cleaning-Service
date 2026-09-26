"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export interface UpdateSettingsData {
  businessName: string;
  tagline: string;
  badgeText: string;
  phone: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsapp: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  address: string;
  mapUrl: string;
  workingHours: string;
  seoTitle: string;
  seoDescription: string;
  copyrightText: string;
  licenceNumber: string;
  licenceStructure: string;
  licenceAuthority: string;
  licenceIssueDate: string;
}

export async function updateSettingsAction(data: UpdateSettingsData) {
  try {
    await prisma.siteSettings.update({
      where: { id: "default" },
      data
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update settings"
    };
  }
}
