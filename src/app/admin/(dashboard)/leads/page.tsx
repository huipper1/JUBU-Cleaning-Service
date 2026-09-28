import type { Prisma } from "@prisma/client";

import type { Lead } from "@/types/lead";

import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";

import { LeadsClient } from "./LeadsClient";

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
  const where: Prisma.LeadWhereInput = {};
  if (status !== "all" && status) {
    where.status = status as Prisma.LeadWhereInput["status"];
  }
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { mobile: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { sourceArea: { contains: search, mode: "insensitive" } }
    ];
  }

  const [
    totalCount,
    dbLeads,
    newCount,
    contactedCount,
    quotationSentCount,
    confirmedCount,
    completedCount,
    lostCancelledCount
  ] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { status: "contacted" } }),
    prisma.lead.count({ where: { status: "quotation_sent" } }),
    prisma.lead.count({ where: { status: "confirmed" } }),
    prisma.lead.count({ where: { status: "completed" } }),
    prisma.lead.count({ where: { status: "lost_cancelled" } })
  ]);

  const allTotalCount =
    newCount +
    contactedCount +
    quotationSentCount +
    confirmedCount +
    completedCount +
    lostCancelledCount;

  const serializedLeads: Lead[] = dbLeads.map((l) => ({
    id: l.id,
    fullName: l.fullName,
    mobile: l.mobile,
    whatsappNumber: l.whatsappNumber ?? undefined,
    serviceId: l.serviceId,
    location: l.location ?? undefined,
    propertyType: l.propertyType ?? undefined,
    preferredDate: l.preferredDate ?? undefined,
    preferredTime: l.preferredTime ?? undefined,
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
    createdAt: l.createdAt.toISOString()
  }));

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6">
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
          total: allTotalCount,
          new: newCount,
          contacted: contactedCount,
          quotation_sent: quotationSentCount,
          confirmed: confirmedCount,
          completed: completedCount,
          lost_cancelled: lostCancelledCount
        }}
      />
    </div>
  );
}
