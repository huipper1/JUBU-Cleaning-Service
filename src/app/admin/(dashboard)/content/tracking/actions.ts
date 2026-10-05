"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export interface UpdateTrackingData {
  gtmId?: string;
  gaId?: string;
}

export async function updateTrackingAction(data: UpdateTrackingData) {
  try {
    const cleanedGtmId = data.gtmId?.trim() ?? "";
    const cleanedGaId = data.gaId?.trim() ?? "";

    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        gtmId: cleanedGtmId,
        gaId: cleanedGaId
      }
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/content/tracking");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update tracking configuration"
    };
  }
}
