import { env } from "@/env";
import { mockContentRepository } from "./mock/repository";
import { prismaContentRepository } from "./prisma/repository";
import type { ContentRepository } from "./repository";

// Dynamic content repository controlled by environment variable
export const contentRepository: ContentRepository =
  env.CONTENT_SOURCE === "prisma" ? prismaContentRepository : mockContentRepository;

// Helper accessor functions
export async function getSettings() {
  return contentRepository.getSettings();
}

export async function getHero() {
  return contentRepository.getHero();
}

export async function getServices() {
  return contentRepository.getServices();
}

export async function getWhyChoose() {
  return contentRepository.getWhyChoose();
}

export async function getAbout() {
  return contentRepository.getAbout();
}

export async function getTeam() {
  return contentRepository.getTeam();
}

export async function getGallery() {
  return contentRepository.getGallery();
}

export async function getAreas() {
  return contentRepository.getAreas();
}

export async function getTestimonials() {
  return contentRepository.getTestimonials();
}

export async function getAreaLandingPages() {
  return contentRepository.getAreaLandingPages();
}

export async function getAreaLandingPage(slug: string) {
  return contentRepository.getAreaLandingPage(slug);
}

export * from "./mock/data/area-landing-pages";
export * from "./repository";
export * from "./types";

