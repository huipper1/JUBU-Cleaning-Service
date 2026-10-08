import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, Calendar, Clock, Share2, ShieldCheck, Sparkles, Tag, User } from "lucide-react";

import { env } from "@/env";

import { getBlogPostBySlug, getRecentBlogPosts, getSettings } from "@/lib/content";
import { getPublicImageUrl } from "@/lib/content/image-url";

import { Footer, Header, StickyBottomBar } from "@/components/layouts";

import { BlogPostBottomActions, BlogPostShareButton } from "./BlogPostActionsClient";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | JUBU Cleaning Service",
      description: "The requested cleaning guide could not be found."
    };
  }

  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";
  const title = post.metaTitle || `${post.title} | JUBU Cleaning Dubai`;
  const description = post.metaDescription || post.excerpt;
  const ogImageUrl = getPublicImageUrl(post.coverImage, "/images/logo.png");

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl.startsWith("http") ? ogImageUrl : `${baseUrl}${ogImageUrl}`,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt || post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl.startsWith("http") ? ogImageUrl : `${baseUrl}${ogImageUrl}`]
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [settings, post, recentPosts] = await Promise.all([
    getSettings(),
    getBlogPostBySlug(slug),
    getRecentBlogPosts(4)
  ]);

  if (!post) {
    notFound();
  }

  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const relatedPosts = recentPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Schema.org BlogPosting Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [
      getPublicImageUrl(post.coverImage, "/images/logo.png").startsWith("http")
        ? getPublicImageUrl(post.coverImage, "/images/logo.png")
        : `${baseUrl}${getPublicImageUrl(post.coverImage, "/images/logo.png")}`
    ],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole || "Cleaning Specialist"
    },
    publisher: {
      "@type": "Organization",
      name: settings.businessName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${post.title} - ${postUrl}`
  )}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative flex min-h-screen flex-col bg-[#020b18] font-sans text-slate-100 selection:bg-brand-sky selection:text-[#020b18]">
        <Header settings={settings} />

        <main className="flex-1">
          {/* Breadcrumbs & Header Section */}
          <section className="relative overflow-hidden border-b border-white/10 bg-radial-[at_top_center] from-[#092b5e] via-[#041633] to-[#020b18] pt-10 pb-12 lg:pt-14 lg:pb-16">
            <div className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Back Link & Breadcrumb */}
              <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-brand-sky transition-colors hover:text-white"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Back to Blog</span>
                </Link>
                <span>/</span>
                <span className="text-slate-400">{post.category}</span>
              </div>

              {/* Category Pill */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md">
                <Sparkles className="size-3.5 text-sky-400" />
                <span>{post.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl leading-tight font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-white/10 pt-6 text-xs text-slate-300 sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-full border border-sky-400/30 bg-sky-500/20 font-bold text-sky-300">
                    <User className="size-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">{post.author}</span>
                    <span className="text-[11px] text-slate-400">
                      {post.authorRole || "Specialist"}
                    </span>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })
                      : "Recent"}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {post.readTime || "5 min read"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Article Main Body */}
          <article className="bg-[#030f24] py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Cover Image */}
              <figure className="relative mb-12 h-72 w-full overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-2xl sm:h-96 lg:h-[460px]">
                <Image
                  src={getPublicImageUrl(post.coverImage, "/images/placeholder/gallery-home.png")}
                  alt={post.coverImageAlt || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </figure>

              {/* Rich Content Area */}
              <div
                className="blog-content prose prose-invert prose-slate prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm prose-p:sm:text-base prose-p:mb-5 prose-ul:text-slate-300 prose-ul:my-5 prose-li:my-1.5 prose-li:text-sm prose-li:sm:text-base prose-blockquote:border-l-4 prose-blockquote:border-brand-sky prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-200 prose-strong:text-white prose-strong:font-bold max-w-none [&_.align-center]:mx-auto [&_.align-center]:my-6 [&_.align-center]:block [&_.align-left]:float-left [&_.align-left]:mr-6 [&_.align-left]:mb-4 [&_.align-right]:float-right [&_.align-right]:mb-4 [&_.align-right]:ml-6 [&_.size-full]:w-full [&_.size-medium]:max-w-[480px] [&_.size-thumb]:max-w-[240px] [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags Row */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-white/10 pt-8">
                  <span className="mr-2 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Tag className="size-3.5 text-brand-sky" />
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share & Quick Action */}
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 sm:flex-row">
                <div className="flex items-center gap-3">
                  <Share2 className="size-5 text-sky-400" />
                  <span className="text-xs font-bold text-white sm:text-sm">
                    Share this guide with friends or tenants:
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <BlogPostShareButton
                    whatsappShareUrl={whatsappShareUrl}
                    postTitle={post.title}
                    slug={post.slug}
                  />
                </div>
              </div>

              {/* High-Converting Bottom CTA Card */}
              <div className="mt-14 overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-r from-[#041d44] via-[#08336a] to-[#041d44] p-8 text-center shadow-2xl sm:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-300">
                  <ShieldCheck className="size-4" />
                  <span>Licensed Dubai Cleaning Services</span>
                </div>
                <h3 className="text-2xl font-black text-white sm:text-3xl">
                  Need Professional Cleaning for Your Home?
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
                  Get same-day service from certified cleaning supervisors with starting rates from
                  only 199 AED.
                </p>
                <BlogPostBottomActions slug={post.slug} />
              </div>
            </div>
          </article>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-white/10 bg-[#020b18] py-16">
              <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <h3 className="mb-8 text-xl font-bold text-white sm:text-2xl">
                  Related Guides & Cleaning Tips
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {relatedPosts.map((rPost) => (
                    <article
                      key={rPost.id}
                      className="group rounded-2xl border border-white/10 bg-[#061e44] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40"
                    >
                      <Link
                        href={`/blog/${rPost.slug}`}
                        className="relative mb-3 block h-40 w-full overflow-hidden rounded-xl bg-slate-900"
                      >
                        <Image
                          src={getPublicImageUrl(
                            rPost.coverImage,
                            "/images/placeholder/gallery-home.png"
                          )}
                          alt={rPost.coverImageAlt || rPost.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </Link>
                      <span className="text-[10px] font-bold tracking-wide text-brand-sky uppercase">
                        {rPost.category}
                      </span>
                      <h4 className="mt-1 line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-sky-300">
                        <Link href={`/blog/${rPost.slug}`}>{rPost.title}</Link>
                      </h4>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{rPost.readTime || "5 min read"}</span>
                        <Link
                          href={`/blog/${rPost.slug}`}
                          className="font-semibold text-brand-sky hover:underline"
                        >
                          Read →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer settings={settings} />
        <StickyBottomBar settings={settings} />
      </div>
    </>
  );
}
