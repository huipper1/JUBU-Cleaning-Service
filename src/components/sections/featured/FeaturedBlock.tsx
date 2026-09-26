import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { FeaturedContentBlock } from "@/types/content";
import { SectionHeading } from "@/ui";

interface FeaturedBlockProps {
  title: string;
  content: string | FeaturedContentBlock[];
  badge?: string;
}

export function FeaturedBlock({
  title,
  content,
  badge = "SPECIALIZED CLEANING"
}: FeaturedBlockProps) {
  const isMultiple = Array.isArray(content);

  return (
    <section
      id="featured-cleaning"
      className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20 border-b border-slate-100"
      aria-label={title}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={badge}
          title={title}
          align="left"
          className="mb-8 max-w-3xl"
        />

        {isMultiple ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {content.map((block, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-[#f9fcfe] p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-white hover:shadow-xl"
              >
                <div>
                  {/* <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100/70 text-[#0070ba] shadow-2xs">
                    <Sparkles className="h-5 w-5" />
                  </div> */}
                  <h3 className="mb-2 text-base font-extrabold text-[#081839] sm:text-lg">
                    {block.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {block.text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <Link
                    href="#quote"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#00a651] transition-colors hover:text-[#008f45]"
                  >
                    <span>Request a Free Quote</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/90 bg-[#f9fcfe] p-7 sm:p-9 lg:p-10 shadow-xs transition-all duration-300 hover:border-sky-300 hover:bg-white hover:shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-3xl">
                {/* <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100/70 text-[#0070ba] shadow-2xs">
                  <Sparkles className="h-5 w-5" />
                </div> */}
                <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                  {content}
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00a651] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#00a651]/20 transition-all duration-200 hover:bg-[#008f45] active:scale-98"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
