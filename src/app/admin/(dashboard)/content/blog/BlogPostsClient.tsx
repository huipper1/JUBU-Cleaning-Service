"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Edit, ExternalLink, FileText, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { BlogPost, PostStatus } from "@/types/content";

import { getPublicImageUrl } from "@/lib/content/image-url";

import { deleteBlogPostAction, toggleBlogPostStatusAction } from "./actions";

interface BlogPostsClientProps {
  initialPosts: BlogPost[];
}

export function BlogPostsClient({ initialPosts }: BlogPostsClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Statistics
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = posts.filter((p) => p.status === "DRAFT").length;

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [posts, statusFilter, searchQuery]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await deleteBlogPostAction(id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Article deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete article");
      }
    } catch {
      toast.error("Failed to delete article.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: PostStatus) => {
    const newStatus: PostStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setTogglingId(id);
    try {
      const res = await toggleBlogPostStatusAction(id, newStatus);
      if (res.success) {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
        toast.success(`Post changed to ${newStatus}`);
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Articles & Cleaning Guides
            </h1>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {totalCount} Total
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your blog posts, SEO guides, and publish articles with WordPress Classic-style
            editor.
          </p>
        </div>

        <Link
          href="/admin/content/blog/new"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`rounded-2xl border p-4 text-left transition-all ${
            statusFilter === "ALL"
              ? "border-primary bg-primary/5 shadow-xs"
              : "border-border/60 bg-card hover:bg-muted/40"
          }`}
        >
          <span className="block text-xs font-medium text-muted-foreground">All Articles</span>
          <span className="mt-1 block text-2xl font-black text-foreground">{totalCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("PUBLISHED")}
          className={`rounded-2xl border p-4 text-left transition-all ${
            statusFilter === "PUBLISHED"
              ? "border-emerald-500 bg-emerald-500/5 shadow-xs"
              : "border-border/60 bg-card hover:bg-muted/40"
          }`}
        >
          <span className="block text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Published Live
          </span>
          <span className="mt-1 block text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {publishedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("DRAFT")}
          className={`rounded-2xl border p-4 text-left transition-all ${
            statusFilter === "DRAFT"
              ? "border-amber-500 bg-amber-500/5 shadow-xs"
              : "border-border/60 bg-card hover:bg-muted/40"
          }`}
        >
          <span className="block text-xs font-medium text-amber-600 dark:text-amber-400">
            Drafts / In Review
          </span>
          <span className="mt-1 block text-2xl font-black text-amber-600 dark:text-amber-400">
            {draftCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, category, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background py-2 pr-4 pl-10 text-xs focus:border-primary focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 self-start text-xs text-muted-foreground sm:self-auto">
          <span>
            Showing {filteredPosts.length} of {totalCount} posts
          </span>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
        {filteredPosts.length === 0 ? (
          <div className="space-y-3 p-12 text-center">
            <FileText className="mx-auto size-10 text-muted-foreground" />
            <h3 className="text-sm font-bold">No articles found</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery
                ? "Try refining your search terms."
                : "Create your first cleaning article now."}
            </p>
            <Link
              href="/admin/content/blog/new"
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-3.5" />
              <span>Create New Article</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3.5">Article</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Author</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-muted/20">
                    {/* Title & Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-slate-900">
                          <Image
                            src={getPublicImageUrl(
                              post.coverImage,
                              "/images/placeholder/gallery-home.png"
                            )}
                            alt={post.coverImageAlt || post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-sm min-w-0">
                          <Link
                            href={`/admin/content/blog/${post.id}`}
                            className="block truncate font-bold text-foreground transition-colors hover:text-primary"
                          >
                            {post.title}
                          </Link>
                          <span className="block truncate font-mono text-[11px] text-muted-foreground">
                            /blog/{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                        {post.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{post.author}</span>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={togglingId === post.id}
                        onClick={() => handleToggleStatus(post.id, post.status)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                          post.status === "PUBLISHED"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                        }`}
                        title="Click to toggle status"
                      >
                        {togglingId === post.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <span
                            className={`size-1.5 rounded-full ${post.status === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-500"}`}
                          />
                        )}
                        <span>{post.status}</span>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })
                        : "Draft"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="rounded-lg border border-border/40 p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Preview live article"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>

                        <Link
                          href={`/admin/content/blog/${post.id}`}
                          className="rounded-lg border border-border/40 p-1.5 text-primary transition-colors hover:bg-muted"
                          title="Edit article"
                        >
                          <Edit className="size-3.5" />
                        </Link>

                        <button
                          type="button"
                          disabled={deletingId === post.id}
                          onClick={() => handleDelete(post.id, post.title)}
                          className="rounded-lg border border-border/40 p-1.5 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                          title="Delete article"
                        >
                          {deletingId === post.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
