"use client";

import Link from "next/link";

import { trackCtaClick } from "@/lib/analytics";

import { WhatsAppIcon } from "@/components/icons";

interface BlogPostShareButtonProps {
  whatsappShareUrl: string;
  postTitle: string;
  slug: string;
}

export function BlogPostShareButton({
  whatsappShareUrl,
  postTitle,
  slug
}: BlogPostShareButtonProps) {
  return (
    <a
      href={whatsappShareUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackCtaClick("share_whatsapp", "blog_post_share", { post_title: postTitle, slug })
      }
      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-500 hover:text-white"
    >
      <WhatsAppIcon className="size-3.5" />
      <span>WhatsApp</span>
    </a>
  );
}

export function BlogPostBottomActions({ slug }: { slug: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
      <Link
        href="/services"
        onClick={() => trackCtaClick("view_all_services", "blog_post_bottom_cta", { slug })}
        className="rounded-full bg-brand-green px-7 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition-all hover:bg-brand-green-hover sm:text-sm"
      >
        View All Services & Rates
      </Link>
      <Link
        href="/contact"
        onClick={() => trackCtaClick("contact_support", "blog_post_bottom_cta", { slug })}
        className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold text-white transition-all hover:bg-white/15 sm:text-sm"
      >
        Contact Support
      </Link>
    </div>
  );
}
