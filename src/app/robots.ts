import type { MetadataRoute } from "next";

import { env } from "@/env";

/**
 * Standard Production robots.txt for JUBU Cleaning Service.
 * Implements Google Search Essentials, Bing Webmaster Guidelines,
 * and AI / LLM crawler standards (GEO) for local service businesses.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/images/",
          "/uploads/"
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/_next/",
          "/private/"
        ]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/"
        ]
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/"
        ]
      },
      // Allow Generative AI / Search Engines for Generative Engine Optimization (GEO)
      {
        userAgent: [
          "GPTBot",
          "Claude-Web",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended"
        ],
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/"
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
