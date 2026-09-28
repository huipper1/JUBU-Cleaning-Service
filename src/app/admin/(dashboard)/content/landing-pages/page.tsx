import Link from "next/link";

import { ArrowRight, CheckCircle2, Eye, Globe2, XCircle } from "lucide-react";

import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateAreaLandingPageDialog } from "./CreateAreaLandingPageDialog";

export const dynamic = "force-dynamic";

export default async function AdminAreaLandingPagesHub() {
  const [pages, services] = await Promise.all([
    prisma.areaLandingPage.findMany({
      orderBy: { areaName: "asc" }
    }),
    prisma.service.findMany({
      orderBy: { order: "asc" }
    })
  ]);

  const serializedServices = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortDescription: s.shortDescription,
    icon: s.icon,
    imageSrc: s.imageSrc,
    isActive: s.isActive
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Area Landing Pages (Ad Targets)"
        description="Dedicated landing pages designed for Google and Facebook Ads campaigns with area-targeted copy."
      >
        <CreateAreaLandingPageDialog availableServices={serializedServices} />
      </AdminPageHeader>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => {
          const faqs = (p.faqs as Array<{ question: string; answer: string }>) ?? [];

          return (
            <Card key={p.id} className="flex flex-col justify-between">
              <div>
                <CardHeader className="flex flex-row items-start justify-between pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Globe2 className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <CardTitle className="text-base">{p.areaName}</CardTitle>
                      <span className="font-mono text-xs text-muted-foreground">/{p.slug}</span>
                    </div>
                  </div>

                  <Badge variant={p.isActive ? "secondary" : "outline"}>
                    {p.isActive ? (
                      <>
                        <CheckCircle2 className="mr-1 size-3 text-emerald-500" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 size-3 text-muted-foreground" />
                        <span>Disabled</span>
                      </>
                    )}
                  </Badge>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  <p className="line-clamp-2 text-xs leading-relaxed font-medium text-foreground">
                    {p.heroHeadline}
                  </p>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {p.heroIntro}
                  </p>

                  <div className="flex flex-wrap gap-2 border-t pt-2 text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">
                      {p.servicesList.length} services listed
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {faqs.length} FAQ items
                    </Badge>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="flex items-center justify-between border-t pt-4">
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-1 size-3.5" />
                    <span>Preview</span>
                  </a>
                </Button>

                <Button size="sm" asChild>
                  <Link href={`/admin/content/landing-pages/${p.slug}`}>
                    <span>Edit Content</span>
                    <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
