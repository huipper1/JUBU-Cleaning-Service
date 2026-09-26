import type { MetadataRoute } from "next";

import { VALID_AREA_SLUGS } from "@/lib/content";
import { env } from "@/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jebucleaning.netlify.app";

  const areaEntries: MetadataRoute.Sitemap = VALID_AREA_SLUGS.map((slug) => ({
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

