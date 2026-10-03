import { cache } from "react";
import { env } from "@/env";
import { mockContentRepository } from "./mock/repository";
import { prismaContentRepository } from "./prisma/repository";
import type { ContentRepository } from "./repository";

// Dynamic content repository controlled by environment variable
export const contentRepository: ContentRepository =
  env.CONTENT_SOURCE === "prisma" ? prismaContentRepository : mockContentRepository;

// Helper accessor functions wrapped with request-level memoization cache()
export const getSettings = cache(async () => {
  return contentRepository.getSettings();
});

export const getHero = cache(async () => {
  return contentRepository.getHero();
});

export const getServices = cache(async () => {
  return contentRepository.getServices();
});

export const getWhyChoose = cache(async () => {
  return contentRepository.getWhyChoose();
});

export const getAbout = cache(async () => {
  return contentRepository.getAbout();
});

export const getTeam = cache(async () => {
  return contentRepository.getTeam();
});

export const getGallery = cache(async () => {
  return contentRepository.getGallery();
});

export const getAreas = cache(async () => {
  return contentRepository.getAreas();
});

export const getTestimonials = cache(async () => {
  return contentRepository.getTestimonials();
});

export const getAreaLandingPages = cache(async () => {
  return contentRepository.getAreaLandingPages();
});

export const getAreaLandingPage = cache(async (slug: string) => {
  return contentRepository.getAreaLandingPage(slug);
});

export * from "./image-url";
export * from "./mock/data/area-landing-pages";
export * from "./repository";
export * from "./types";

