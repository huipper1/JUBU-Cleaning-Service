import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import {
  Inbox,
  Globe2,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [leadCount, pendingLeadCount, servicesCount, landingPagesCount, recentLeads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "pending" } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.areaLandingPage.count({ where: { isActive: true } }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Dashboard Overview"
        description="Welcome back. Summary of your website content, marketing landing pages, and lead pipeline."
      >
        <Button variant="outline" size="sm" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink data-icon="inline-start" />
            Live Website
          </a>
        </Button>
      </AdminPageHeader>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads Received
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Inbox className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadCount}</div>
            <p className="text-xs text-muted-foreground">all-time submissions</p>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Awaiting Follow-up
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingLeadCount}
            </div>
            <p className="text-xs text-muted-foreground">pending response</p>
          </CardContent>
        </Card>

        {/* Area Landing Pages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Area Landing Pages
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Globe2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {landingPagesCount}
            </div>
            <p className="text-xs text-muted-foreground">active target areas</p>
          </CardContent>
        </Card>

        {/* Active Services */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Services
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Layers className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesCount}</div>
            <p className="text-xs text-muted-foreground">live catalog items</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Leads & Content Hubs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent Inquiries</CardTitle>
              <CardDescription>
                Latest customer quote submissions across all channels
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/leads">
                View All
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                <Inbox className="size-8 text-muted-foreground/40 mb-2" />
                No inquiries received yet. Incoming submissions will appear here.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{lead.fullName}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {lead.sourceArea ?? "main-page"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {lead.mobile} &bull; {lead.serviceId}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          lead.status === "pending"
                            ? "outline"
                            : lead.status === "contacted"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {lead.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links & Publishing Status */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content Hubs</CardTitle>
              <CardDescription>Quick shortcuts to manage website content</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button variant="outline" className="justify-between" asChild>
                <Link href="/admin/content/landing-pages">
                  <div className="flex items-center gap-2">
                    <Globe2 className="size-4 text-emerald-500" />
                    <span>Area Landing Pages</span>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button variant="outline" className="justify-between" asChild>
                <Link href="/admin/content/services">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-purple-500" />
                    <span>Services & Pricing</span>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>

              <Button variant="outline" className="justify-between" asChild>
                <Link href="/admin/content/settings">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-teal-500" />
                    <span>Phone, WhatsApp & Trade Info</span>
                  </div>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
                <span>Direct Publishing Active</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Edits made in this admin dashboard revalidate live website routes automatically via Next.js cache tags.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
