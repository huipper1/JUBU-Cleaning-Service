"use server";

import { revalidatePath } from "next/cache";

import slugify from "@sindresorhus/slugify";

import type { BlogPost, PostStatus } from "@/types/content";

import { prisma } from "@/lib/db/prisma";

export interface BlogPostFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole?: string;
  status: PostStatus;
  publishedAt?: string;
  readTime?: string;
  metaTitle?: string;
  metaDescription?: string;
  order?: number;
}

export async function getAllBlogPostsAction(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM "BlogPost" ORDER BY "createdAt" DESC`
    );

    return rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      coverImage: String(row.coverImage),
      coverImageAlt: String(row.coverImageAlt || row.title),
      category: String(row.category || "Cleaning Tips"),
      tags: Array.isArray(row.tags) ? row.tags : [],
      author: String(row.author || "JUBU Expert Team"),
      authorRole: row.authorRole ? String(row.authorRole) : undefined,
      status: row.status as PostStatus,
      publishedAt: row.publishedAt ? new Date(String(row.publishedAt)).toISOString() : undefined,
      readTime: row.readTime ? String(row.readTime) : "5 min read",
      metaTitle: row.metaTitle ? String(row.metaTitle) : undefined,
      metaDescription: row.metaDescription ? String(row.metaDescription) : undefined,
      order: Number(row.order ?? 0),
      createdAt: new Date(String(row.createdAt)).toISOString(),
      updatedAt: new Date(String(row.updatedAt)).toISOString()
    }));
  } catch (err) {
    console.error("Error fetching all blog posts:", err);
    return [];
  }
}

export async function getBlogPostByIdAction(id: string): Promise<BlogPost | null> {
  try {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM "BlogPost" WHERE "id" = $1 LIMIT 1`,
      id
    );

    if (!rows || rows.length === 0) return null;
    const row = rows[0];

    return {
      id: String(row.id),
      title: String(row.title),
      slug: String(row.slug),
      excerpt: String(row.excerpt),
      content: String(row.content),
      coverImage: String(row.coverImage),
      coverImageAlt: String(row.coverImageAlt || row.title),
      category: String(row.category || "Cleaning Tips"),
      tags: Array.isArray(row.tags) ? row.tags : [],
      author: String(row.author || "JUBU Expert Team"),
      authorRole: row.authorRole ? String(row.authorRole) : undefined,
      status: row.status as PostStatus,
      publishedAt: row.publishedAt ? new Date(String(row.publishedAt)).toISOString() : undefined,
      readTime: row.readTime ? String(row.readTime) : "5 min read",
      metaTitle: row.metaTitle ? String(row.metaTitle) : undefined,
      metaDescription: row.metaDescription ? String(row.metaDescription) : undefined,
      order: Number(row.order ?? 0),
      createdAt: new Date(String(row.createdAt)).toISOString(),
      updatedAt: new Date(String(row.updatedAt)).toISOString()
    };
  } catch (err) {
    console.error("Error fetching post by id:", err);
    return null;
  }
}

export async function createBlogPostAction(data: BlogPostFormData) {
  try {
    const cleanSlug = data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.title);
    const existing = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT "id" FROM "BlogPost" WHERE "slug" = $1 LIMIT 1`,
      cleanSlug
    );

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: `An article with slug "${cleanSlug}" already exists. Please customize the slug.`
      };
    }

    const id = `post-${Date.now()}`;
    const publishedAt =
      data.status === "PUBLISHED"
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : new Date()
        : null;

    await prisma.$executeRawUnsafe(
      `INSERT INTO "BlogPost" (
        "id", "title", "slug", "excerpt", "content", "coverImage", "coverImageAlt",
        "category", "tags", "author", "authorRole", "status", "publishedAt",
        "readTime", "metaTitle", "metaDescription", "order", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::"PostStatus", $13,
        $14, $15, $16, $17, NOW(), NOW()
      )`,
      id,
      data.title.trim(),
      cleanSlug,
      data.excerpt.trim(),
      data.content,
      data.coverImage,
      data.coverImageAlt || data.title,
      data.category || "Cleaning Tips",
      data.tags || [],
      data.author || "JUBU Expert Team",
      data.authorRole || "Cleaning Specialist",
      data.status,
      publishedAt,
      data.readTime || "5 min read",
      data.metaTitle || data.title,
      data.metaDescription || data.excerpt,
      data.order ?? 0
    );

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${cleanSlug}`);
    revalidatePath("/admin/content/blog");

    return { success: true, id, slug: cleanSlug };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create article"
    };
  }
}

export async function updateBlogPostAction(id: string, data: BlogPostFormData) {
  try {
    const cleanSlug = data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.title);
    const existingSlug = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT "id" FROM "BlogPost" WHERE "slug" = $1 AND "id" != $2 LIMIT 1`,
      cleanSlug,
      id
    );

    if (existingSlug && existingSlug.length > 0) {
      return {
        success: false,
        error: `Another article already uses the slug "${cleanSlug}". Please choose a different slug.`
      };
    }

    const publishedAt =
      data.status === "PUBLISHED"
        ? data.publishedAt
          ? new Date(data.publishedAt)
          : new Date()
        : null;

    await prisma.$executeRawUnsafe(
      `UPDATE "BlogPost" SET
        "title" = $1,
        "slug" = $2,
        "excerpt" = $3,
        "content" = $4,
        "coverImage" = $5,
        "coverImageAlt" = $6,
        "category" = $7,
        "tags" = $8,
        "author" = $9,
        "authorRole" = $10,
        "status" = $11::"PostStatus",
        "publishedAt" = $12,
        "readTime" = $13,
        "metaTitle" = $14,
        "metaDescription" = $15,
        "order" = $16,
        "updatedAt" = NOW()
      WHERE "id" = $17`,
      data.title.trim(),
      cleanSlug,
      data.excerpt.trim(),
      data.content,
      data.coverImage,
      data.coverImageAlt || data.title,
      data.category || "Cleaning Tips",
      data.tags || [],
      data.author || "JUBU Expert Team",
      data.authorRole || "Cleaning Specialist",
      data.status,
      publishedAt,
      data.readTime || "5 min read",
      data.metaTitle || data.title,
      data.metaDescription || data.excerpt,
      data.order ?? 0,
      id
    );

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${cleanSlug}`);
    revalidatePath("/admin/content/blog");

    return { success: true, slug: cleanSlug };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update article"
    };
  }
}

export async function deleteBlogPostAction(id: string) {
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "BlogPost" WHERE "id" = $1`, id);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/content/blog");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete article"
    };
  }
}

export async function toggleBlogPostStatusAction(id: string, newStatus: PostStatus) {
  try {
    const publishedAt = newStatus === "PUBLISHED" ? new Date() : null;

    await prisma.$executeRawUnsafe(
      `UPDATE "BlogPost" SET "status" = $1::"PostStatus", "publishedAt" = COALESCE("publishedAt", $2), "updatedAt" = NOW() WHERE "id" = $3`,
      newStatus,
      publishedAt,
      id
    );

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/content/blog");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle status"
    };
  }
}
