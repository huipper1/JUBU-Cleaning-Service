import type { MetadataRoute } from "next";

import { getAreas, VALID_AREA_SLUGS } from "@/lib/content";
import { env } from "@/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  let areaSlugs: string[] = [...VALID_AREA_SLUGS];
  try {
    const areas = await getAreas();
    if (areas && areas.length > 0) {
      areaSlugs = areas.map((a) => a.slug);
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

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0
    },
    ...areaEntries
  ];
}

