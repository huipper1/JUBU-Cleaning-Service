import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";

import type { BlogPost } from "@/types/content";

import { getPublicImageUrl } from "@/lib/content/image-url";

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  const recentPosts = posts.slice(0, 3);

  return (
    <section className="relative border-t border-white/10 bg-[#020b18] py-20 lg:py-28" id="blog">
      {/* Subtle Glow Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-[700px] rounded-full bg-sky-600/10 blur-[130px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
              <Sparkles className="size-3.5 text-sky-400" />
              <span>Expert Cleaning Insights</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Dubai Cleaning Guides & Tips
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Actionable advice on home sanitization, tenancy move-out deposits, and allergy
              prevention in the UAE climate.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold text-white backdrop-blur-md transition-all hover:border-sky-400/50 hover:bg-white/15 sm:text-sm md:self-auto"
          >
            <span>View All Articles</span>
            <ArrowRight className="size-4 text-sky-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Posts Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
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
                  {/* Category Badge */}
                  <span className="absolute top-3.5 left-3.5 inline-flex items-center rounded-full border border-white/20 bg-[#020b18]/85 px-3 py-1 text-[11px] font-bold text-sky-300 shadow-md backdrop-blur-md">
                    {post.category}
                  </span>
                </Link>

                {/* Metadata Row */}
                <div className="mb-3 flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-slate-400" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "Recent"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-slate-400" />
                    {post.readTime || "5 min read"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-sky-300 sm:text-xl">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
                  {post.excerpt}
                </p>
              </div>

              {/* Bottom Link */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sky transition-colors group-hover:text-white"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
