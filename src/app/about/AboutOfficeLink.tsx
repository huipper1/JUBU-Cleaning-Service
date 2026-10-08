"use client";

import Link from "next/link";

import { trackCtaClick } from "@/lib/analytics";

export function AboutOfficeLink() {
  return (
    <Link
      href="/contact"
      onClick={() => trackCtaClick("visit_our_office", "about_page_licence_card")}
      className="text-xs font-bold text-sky-300 transition-colors hover:text-white"
    >
      Visit Our Office →
    </Link>
  );
}
