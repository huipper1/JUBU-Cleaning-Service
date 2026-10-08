import type { Metadata } from "next";

import { Sparkles } from "lucide-react";

import { env } from "@/env";

import { getBlogPosts, getSettings } from "@/lib/content";

import { Footer, Header, StickyBottomBar } from "@/components/layouts";

import { BlogIndexClient } from "./BlogIndexClient";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";
  const title = `Dubai Cleaning Guides & Tips | ${settings.businessName}`;
  const description =
    "Expert cleaning advice, tenancy deposit checklists, and upholstery maintenance guides curated by certified Dubai cleaning specialists.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/blog`
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog`,
      siteName: settings.businessName,
      locale: "en_AE",
      type: "website"
    }
  };
}

export default async function BlogPage() {
  const [settings, posts] = await Promise.all([getSettings(), getBlogPosts()]);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL || "https://jubucleaning.com";

  // Schema.org Blog collection
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${settings.businessName} Cleaning Insights`,
    description: "Cleaning tips, villa hygiene guides, and tenancy handover advice in Dubai.",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: settings.businessName,
      url: baseUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="relative flex min-h-screen flex-col bg-[#020b18] font-sans text-slate-100 selection:bg-brand-sky selection:text-[#020b18]">
        <Header settings={settings} />

        <main className="flex-1">
          {/* Hero Banner */}
          <section className="relative overflow-hidden border-b border-white/10 bg-radial-[at_top_center] from-[#09295a] via-[#041633] to-[#020b18] pt-12 pb-16 lg:pt-16 lg:pb-24">
            <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold text-sky-300 backdrop-blur-md">
                <Sparkles className="size-3.5 text-sky-400" />
                <span>Hygiene & Sanitization Knowledge Base</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Dubai Cleaning Insights & Guides
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Practical tips from licensed Dubai cleaning experts on tenancy move-out handovers,
                AC hygiene, upholstery deep cleaning, and villa sanitization.
              </p>
            </div>
          </section>

          {/* Interactive Posts Explorer */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BlogIndexClient initialPosts={posts} />
          </div>
        </main>

        <Footer settings={settings} />
        <StickyBottomBar settings={settings} />
      </div>
    </>
  );
}
