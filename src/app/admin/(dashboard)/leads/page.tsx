import { prisma } from "@/lib/db/prisma";
import type { Lead } from "@/types/lead";
import { LeadsClient } from "./LeadsClient";
import { AdminPageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

interface AdminLeadsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const pageSize = 10;
  const search = resolvedParams.search || "";
  const status = resolvedParams.status || "all";

  // Build prisma filter
  const where: any = {};
  if (status !== "all" && status) {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { mobile: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { sourceArea: { contains: search, mode: "insensitive" } },
    ];
  }

  const [totalCount, dbLeads, pendingCount, contactedCount, closedCount] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where: { status: "pending" } }),
    prisma.lead.count({ where: { status: "contacted" } }),
    prisma.lead.count({ where: { status: "closed" } }),
  ]);

  const serializedLeads: Lead[] = dbLeads.map((l) => ({
    id: l.id,
    fullName: l.fullName,
    mobile: l.mobile,
    whatsappNumber: l.whatsappNumber ?? undefined,
    serviceId: l.serviceId,
    location: l.location ?? undefined,
    propertyType: l.propertyType ?? undefined,
    preferredDate: l.preferredDate ?? undefined,
    message: l.message ?? undefined,
    whatsappOptIn: l.whatsappOptIn,
    sourceArea: l.sourceArea ?? undefined,
    utmSource: l.utmSource ?? undefined,
    utmMedium: l.utmMedium ?? undefined,
    utmCampaign: l.utmCampaign ?? undefined,
    utmContent: l.utmContent ?? undefined,
    fbclid: l.fbclid ?? undefined,
    landingUrl: l.landingUrl ?? undefined,
    status: l.status as Lead["status"],
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Leads Inbox & CRM Pipeline"
        description="Manage inbound quote inquiries, follow-ups, and operational notes with server-side pagination."
      />

      <LeadsClient
        leads={serializedLeads}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        searchValue={search}
        statusFilter={status}
        metrics={{
          total: totalCount,
          pending: pendingCount,
          contacted: contactedCount,
          closed: closedCount,
        }}
      />
    </div>
  );
}
