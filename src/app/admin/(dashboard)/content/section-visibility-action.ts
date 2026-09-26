"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export type SectionKey =
  | "showHero"
  | "showServices"
  | "showWhyChoose"
  | "showAbout"
  | "showTeam"
  | "showGallery"
  | "showQuote"
  | "showAreas"
  | "showContact";

export async function toggleSectionVisibilityAction(
  sectionKey: SectionKey,
  isVisible: boolean
) {
  try {
    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        [sectionKey]: isVisible,
      },
    });

    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle section visibility",
    };
  }
}
