"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

export async function toggleWhyChooseActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.whyChooseItem.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle item"
    };
  }
}

export async function updateWhyChooseAction(
  id: string,
  data: {
    title: string;
    description: string;
    order: number;
    isActive: boolean;
  }
) {
  try {
    await prisma.whyChooseItem.update({
      where: { id },
      data
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update item"
    };
  }
}
