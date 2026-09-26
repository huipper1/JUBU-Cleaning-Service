import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Globe2, ArrowRight, Eye, CheckCircle2, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminAreaLandingPagesHub() {
  const pages = await prisma.areaLandingPage.findMany({
    orderBy: { areaName: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Area Landing Pages (Ad Targets)"
        description="Dedicated landing pages designed for Google and Facebook Ads campaigns with area-targeted copy."
      />

      {/* Pages Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => {
          const faqs =
            (p.faqs as Array<{ question: string; answer: string }>) ?? [];

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
                      <span className="font-mono text-xs text-muted-foreground">
                        /{p.slug}
                      </span>
                    </div>
                  </div>

                  <Badge variant={p.isActive ? "secondary" : "outline"}>
                    {p.isActive ? (
                      <>
                        <CheckCircle2 className="size-3 text-emerald-500 mr-1" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-3 text-muted-foreground mr-1" />
                        <span>Disabled</span>
                      </>
                    )}
                  </Badge>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  <p className="line-clamp-2 text-xs font-medium text-foreground leading-relaxed">
                    {p.heroHeadline}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {p.heroIntro}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 border-t text-[11px] text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">
                      {p.servicesList.length} services listed
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {faqs.length} FAQ items
                    </Badge>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={`/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="size-3.5 mr-1" />
                    <span>Preview</span>
                  </a>
                </Button>

                <Button size="sm" asChild>
                  <Link href={`/admin/content/landing-pages/${p.slug}`}>
                    <span>Edit Content</span>
                    <ArrowRight className="size-3.5 ml-1" />
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
