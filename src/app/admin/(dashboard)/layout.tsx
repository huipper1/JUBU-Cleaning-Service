import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPublicImageUrl } from "@/lib/content/image-url";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";

import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const [
    {
      data: { user }
    },
    settings
  ] = await Promise.all([
    supabase.auth.getUser(),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
      select: { logoSrc: true, logoAlt: true, businessName: true }
    })
  ]);

  // Route protection
  if (!user) {
    redirect("/admin/login");
  }

  // Read sidebar state cookie for persistence
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const brandingLogo = getPublicImageUrl(settings?.logoSrc, "/images/logo.png");

  const userData = {
    name: user.email?.split("@")[0] || "Admin",
    email: user.email || "admin@jubucleaning.ae",
    avatar: brandingLogo
  };

  const branding = {
    logoSrc: brandingLogo,
    logoAlt: settings?.logoAlt || "JUBU Cleaning Service",
    businessName: settings?.businessName || "JUBU Cleaning"
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={userData} branding={branding} />
      <SidebarInset className="max-w-full min-w-0 overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">JUBU Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Management Console</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="hidden items-center gap-1.5 text-xs font-normal text-muted-foreground sm:inline-flex"
            >
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              Connected
            </Badge>
          </div>
        </header>

        <div className="flex max-w-full min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
