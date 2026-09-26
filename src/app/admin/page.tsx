import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import {
  Inbox,
  Globe2,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [leadCount, pendingLeadCount, servicesCount, areasCount, landingPagesCount, recentLeads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "pending" } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.serviceArea.count({ where: { isActive: true } }),
      prisma.areaLandingPage.count({ where: { isActive: true } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" }
      })
    ]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back. Here is a summary of your website content, marketing landing pages, and lead pipeline.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Leads */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Leads Received</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Inbox className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{leadCount}</span>
            <span className="text-xs text-slate-400">records</span>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Awaiting Follow-up</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">{pendingLeadCount}</span>
            <span className="text-xs text-slate-400">pending response</span>
          </div>
        </div>

        {/* Area Landing Pages */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Area Landing Pages</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Globe2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400">{landingPagesCount}</span>
            <span className="text-xs text-slate-400">ad landing targets</span>
          </div>
        </div>

        {/* Active Services */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Services</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{servicesCount}</span>
            <span className="text-xs text-slate-400">live offerings</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Leads Table (2 cols) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Inquiries</h2>
              <p className="text-xs text-slate-400">Latest customer quote submissions across all channels</p>
            </div>
            <Link
              href="/admin/leads"
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-800/60">
            {recentLeads.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No inquiries received yet. Incoming submissions will appear here.
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{lead.fullName}</span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {lead.sourceArea ?? "main-page"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {lead.mobile} &bull; {lead.serviceId}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        lead.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                          : lead.status === "contacted"
                          ? "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <div className="mt-0.5 text-[10px] text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fast Action Cards (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
            <h2 className="text-base font-semibold text-white">Content Hubs</h2>
            <p className="mt-1 text-xs text-slate-400">Quick shortcuts to manage website content</p>

            <div className="mt-4 space-y-2">
              <Link
                href="/admin/content/landing-pages"
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/40 hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-2.5">
                  <Globe2 className="h-4 w-4 text-emerald-400" />
                  <span>Area Landing Pages (5 Areas)</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>

              <Link
                href="/admin/content/services"
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/40 hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>Services & Descriptions</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>

              <Link
                href="/admin/content/settings"
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/40 hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-teal-400" />
                  <span>Business Phone & Trade Licence</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Direct Publishing Active</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Edits made in this admin dashboard revalidate live website routes automatically via Next.js cache tags.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
