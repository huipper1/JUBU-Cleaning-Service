import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Globe2, ArrowRight, Eye, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAreaLandingPagesHub() {
  const pages = await prisma.areaLandingPage.findMany({
    orderBy: { areaName: "asc" }
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Area Landing Pages (Ad Targets)</h1>
          <p className="mt-1 text-sm text-slate-400">
            Dedicated landing pages designed for Google and Facebook Ads campaigns with area-targeted copy.
          </p>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => {
          const faqs = (p.faqs as Array<{ question: string; answer: string }>) ?? [];

          return (
            <div
              key={p.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl transition-all hover:border-slate-700"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Globe2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">{p.areaName}</h2>
                      <span className="font-mono text-xs text-slate-400">/{p.slug}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      p.isActive
                        ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                        : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                    }`}
                  >
                    {p.isActive ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        <span>Disabled</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="line-clamp-2 text-xs text-slate-300 leading-relaxed font-medium">
                    {p.heroHeadline}
                  </p>
                  <p className="line-clamp-2 text-xs text-slate-400 leading-relaxed">
                    {p.heroIntro}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span className="rounded-md bg-slate-950/60 px-2 py-1 border border-slate-800/60">
                    {p.servicesList.length} services listed
                  </span>
                  <span className="rounded-md bg-slate-950/60 px-2 py-1 border border-slate-800/60">
                    {faqs.length} FAQ questions
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-800/80">
                <a
                  href={`/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </a>

                <Link
                  href={`/admin/content/landing-pages/${p.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <span>Edit Content</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
