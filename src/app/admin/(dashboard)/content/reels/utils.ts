import type { VideoReel, VideoReelsConfig } from "@/types/content";

export function parseConfig(raw: unknown): VideoReelsConfig {
  if (Array.isArray(raw)) {
    return {
      badge: "WATCH US IN ACTION",
      heading: "Real Work & Transformations",
      subheading:
        "Short 15-second reels of our licensed Dubai specialists operating professional equipment.",
      items: raw as VideoReel[]
    };
  }
  if (raw && typeof raw === "object") {
    const obj = raw as Partial<VideoReelsConfig>;
    return {
      badge: obj.badge || "WATCH US IN ACTION",
      heading: obj.heading || "Real Work & Transformations",
      subheading:
        obj.subheading ||
        "Short 15-second reels of our licensed Dubai specialists operating professional equipment.",
      items: Array.isArray(obj.items) ? obj.items : []
    };
  }
  return {
    badge: "WATCH US IN ACTION",
    heading: "Real Work & Transformations",
    subheading:
      "Short 15-second reels of our licensed Dubai specialists operating professional equipment.",
    items: []
  };
}
