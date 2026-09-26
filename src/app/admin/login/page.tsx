import { prisma } from "@/lib/db/prisma";
import { AdminLoginForm } from "./AdminLoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
    select: { logoSrc: true, logoAlt: true, businessName: true }
  });

  const branding = {
    logoSrc: settings?.logoSrc || "/images/logo.png",
    logoAlt: settings?.logoAlt || "JUBU Cleaning Service",
    businessName: settings?.businessName || "JUBU Cleaning Service"
  };

  return <AdminLoginForm branding={branding} />;
}
