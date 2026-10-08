"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export interface TestimonialFormData {
  name: string;
  location: string;
  service: string;
  rating: number;
  quote: string;
  avatarSrc?: string;
  order: number;
  isActive: boolean;
}

export async function toggleTestimonialActiveAction(id: string, isActive: boolean) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle review status"
    };
  }
}

export async function createTestimonialAction(data: TestimonialFormData) {
  try {
    await prisma.testimonial.create({
      data: {
        name: data.name,
        location: data.location || "Dubai",
        service: data.service || "Deep Cleaning",
        rating: Math.min(5, Math.max(1, data.rating || 5)),
        quote: data.quote,
        avatarSrc: data.avatarSrc || null,
        order: data.order || 0,
        isActive: data.isActive
      }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create review"
    };
  }
}

export async function updateTestimonialAction(id: string, data: TestimonialFormData) {
  try {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        location: data.location,
        service: data.service,
        rating: Math.min(5, Math.max(1, data.rating)),
        quote: data.quote,
        avatarSrc: data.avatarSrc || null,
        order: data.order,
        isActive: data.isActive
      }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update review"
    };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id }
    });
    revalidatePath("/");
    revalidatePath("/[area]", "page");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete review"
    };
  }
}
