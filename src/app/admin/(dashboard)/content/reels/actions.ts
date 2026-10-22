"use server";

import { revalidatePath } from "next/cache";

import type { VideoReel, VideoReelsConfig } from "@/types/content";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";

import { parseConfig } from "./utils";

export async function getVideoReelsConfigAction(): Promise<VideoReelsConfig> {
  try {
    const s = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { videoReels: true }
    });
    return parseConfig(s?.videoReels);
  } catch {
    return {
      badge: "WATCH US IN ACTION",
      heading: "Real Work & Transformations",
      subheading:
        "Short 15-second reels of our licensed Dubai specialists operating professional equipment.",
      items: []
    };
  }
}

export async function uploadMediaAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "reels";
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const supabase = await createClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${folder}/${Date.now()}-${safeName}`;

    const { data, error } = await supabase.storage
      .from("cms-media")
      .upload(fileName, buffer, {
        contentType: file.type || (folder === "reels" ? "video/mp4" : "image/jpeg"),
        cacheControl: "31536000",
        upsert: true
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from("cms-media").getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to upload file."
    };
  }
}

export async function updateVideoReelsHeaderAction(header: {
  badge: string;
  heading: string;
  subheading: string;
}) {
  try {
    const s = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { videoReels: true }
    });

    const currentConfig = parseConfig(s?.videoReels);
    const newConfig: VideoReelsConfig = {
      ...currentConfig,
      badge: header.badge?.trim() || "WATCH US IN ACTION",
      heading: header.heading?.trim() || "Real Work & Transformations",
      subheading: header.subheading?.trim() || ""
    };

    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        videoReels: newConfig as unknown as import("@prisma/client").Prisma.InputJsonValue
      }
    });

    revalidatePath("/");
    revalidatePath("/admin/content/reels");

    return { success: true, config: newConfig };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update header."
    };
  }
}

export async function saveVideoReelAction(reelData: VideoReel) {
  try {
    if (!reelData.videoUrl?.trim()) {
      return { success: false, error: "Video is required (please upload a video file or paste a video link)." };
    }

    const s = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { videoReels: true }
    });

    const currentConfig = parseConfig(s?.videoReels);
    let updatedItems: VideoReel[];
    const exists = currentConfig.items.some((r) => r.id === reelData.id);

    if (exists) {
      updatedItems = currentConfig.items.map((r) =>
        r.id === reelData.id ? { ...reelData } : r
      );
    } else {
      updatedItems = [
        ...currentConfig.items,
        {
          ...reelData,
          id: reelData.id || `reel-${Date.now()}`
        }
      ];
    }

    const newConfig: VideoReelsConfig = {
      ...currentConfig,
      items: updatedItems
    };

    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        videoReels: newConfig as unknown as import("@prisma/client").Prisma.InputJsonValue
      }
    });

    revalidatePath("/");
    revalidatePath("/admin/content/reels");

    return { success: true, config: newConfig, reels: updatedItems };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save video reel."
    };
  }
}

export async function deleteVideoReelAction(id: string) {
  try {
    const s = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { videoReels: true }
    });

    const currentConfig = parseConfig(s?.videoReels);
    const updatedItems = currentConfig.items.filter((r) => r.id !== id);

    const newConfig: VideoReelsConfig = {
      ...currentConfig,
      items: updatedItems
    };

    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        videoReels: newConfig as unknown as import("@prisma/client").Prisma.InputJsonValue
      }
    });

    revalidatePath("/");
    revalidatePath("/admin/content/reels");

    return { success: true, config: newConfig, reels: updatedItems };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete video reel."
    };
  }
}

export async function toggleVideoReelActiveAction(id: string) {
  try {
    const s = await prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { videoReels: true }
    });

    const currentConfig = parseConfig(s?.videoReels);
    const updatedItems = currentConfig.items.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );

    const newConfig: VideoReelsConfig = {
      ...currentConfig,
      items: updatedItems
    };

    await prisma.siteSettings.update({
      where: { id: "default" },
      data: {
        videoReels: newConfig as unknown as import("@prisma/client").Prisma.InputJsonValue
      }
    });

    revalidatePath("/");
    revalidatePath("/admin/content/reels");

    return { success: true, config: newConfig, reels: updatedItems };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle reel status."
    };
  }
}
