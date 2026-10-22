import type { MetadataRoute } from "next";

import { env } from "@/env";

import { getAreaLandingPages, getBlogPosts, VALID_AREA_SLUGS } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  let areaSlugs: string[] = [...VALID_AREA_SLUGS];
  try {
    const landingPages = await getAreaLandingPages();
    if (landingPages && landingPages.length > 0) {
      areaSlugs = landingPages.map((a) => a.slug);
    }
  } catch {
    // Keep fallback slugs on error
  }

  const areaEntries: MetadataRoute.Sitemap = areaSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts();
    blogEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    }));
  } catch {
    // Keep empty on error
  }

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    ...areaEntries,
    ...blogEntries
  ];
}
