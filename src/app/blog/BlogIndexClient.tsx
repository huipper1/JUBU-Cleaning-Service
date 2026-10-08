"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Calendar, Clock, Search } from "lucide-react";

import type { BlogPost } from "@/types/content";

import { getPublicImageUrl } from "@/lib/content/image-url";

interface BlogIndexClientProps {
  initialPosts: BlogPost[];
}

export function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [initialPosts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = initialPosts[0];

  return (
    <div className="py-12 sm:py-16">
      {/* Search and Category Filter Bar */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-brand-sky text-[#020b18] shadow-md shadow-sky-500/30"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides, tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-white/15 bg-white/5 py-2 pr-4 pl-10 text-xs text-white placeholder-slate-400 focus:border-brand-sky focus:ring-1 focus:ring-brand-sky focus:outline-none"
          />
        </div>
      </div>

      {/* Featured Post Card (Show when viewing "All" and no search query) */}
      {selectedCategory === "All" && !searchQuery.trim() && featuredPost && (
        <div className="mb-16">
          <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#061e44] via-[#082a5c] to-[#041633] p-6 shadow-2xl transition-all duration-300 hover:border-sky-400/40 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 sm:h-80">
                <Image
                  src={getPublicImageUrl(
                    featuredPost.coverImage,
                    "/images/placeholder/gallery-home.png"
                  )}
                  alt={featuredPost.coverImageAlt || featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <span className="absolute top-4 left-4 rounded-full border border-white/20 bg-[#020b18]/85 px-3 py-1 text-xs font-bold text-sky-300 backdrop-blur-md">
                  ★ Featured Guide
                </span>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
                  <span className="font-semibold text-brand-sky">{featuredPost.category}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime || "5 min read"}</span>
                  <span>•</span>
                  <span>
                    {featuredPost.publishedAt
                      ? new Date(featuredPost.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "Recent"}
                  </span>
                </div>

                <h2 className="text-2xl leading-tight font-extrabold text-white transition-colors group-hover:text-sky-300 sm:text-3xl">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>

                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-sky px-6 py-2.5 text-xs font-bold text-[#020b18] shadow-md shadow-sky-500/20 transition-all hover:bg-sky-300"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <span className="text-xs text-slate-400">By {featuredPost.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtered Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 py-20 text-center">
          <p className="font-medium text-slate-300">No articles found matching your criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 text-xs font-bold text-brand-sky hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#061e44]/80 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-2xl hover:shadow-sky-950/60"
            >
              <div>
                {/* Thumbnail */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative mb-5 block h-52 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900"
                >
                  <Image
                    src={getPublicImageUrl(post.coverImage, "/images/placeholder/gallery-home.png")}
                    alt={post.coverImageAlt || post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <span className="absolute top-3.5 left-3.5 inline-flex items-center rounded-full border border-white/20 bg-[#020b18]/85 px-3 py-1 text-[11px] font-bold text-sky-300 backdrop-blur-md">
                    {post.category}
                  </span>
                </Link>

                {/* Metadata */}
                <div className="mb-2.5 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3.5 text-slate-400" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "Recent"}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5 text-slate-400" />
                    {post.readTime || "5 min read"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-sky-300">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  {post.excerpt}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-sky transition-colors group-hover:text-white"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="text-[11px] text-slate-400">By {post.author}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
