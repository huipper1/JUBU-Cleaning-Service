import type { MetadataRoute } from "next";

import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      },
      {
        userAgent: ["GPTBot", "Claude-Web", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"],
        allow: "/"
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
