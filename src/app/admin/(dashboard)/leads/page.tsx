import type { Prisma } from "@prisma/client";

import type { BankTransferDetails, Lead } from "@/types/lead";

import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";

import { LeadsClient } from "./LeadsClient";

export const dynamic = "force-dynamic";

interface AdminLeadsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
    view?: string;
  }>;
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const pageSize = 10;
  const search = resolvedParams.search || "";
  const status = resolvedParams.status || "all";
  const paymentMethod = resolvedParams.paymentMethod || "all";
  const startDate = resolvedParams.startDate || "";
  const endDate = resolvedParams.endDate || "";
  const view = resolvedParams.view === "trash" ? "trash" : "active";

  // Build prisma filter
  const where: Prisma.LeadWhereInput = {};

  if (view === "trash") {
    where.deletedAt = { not: null };
  } else {
    where.deletedAt = null;
  }

  if (status !== "all" && status) {
    where.status = status as Prisma.LeadWhereInput["status"];
  }

  if (paymentMethod !== "all" && paymentMethod) {
    if (paymentMethod === "quote") {
      where.requestType = "quote";
    } else if (paymentMethod === "cash") {
      where.paymentMethod = "cash";
    } else if (paymentMethod === "bank_transfer") {
      where.paymentMethod = "bank_transfer";
    }
  }

  // Date range filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
    }
    if (endDate) {
      where.createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
    }
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { mobile: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { sourceArea: { contains: search, mode: "insensitive" } },
      { transactionRef: { contains: search, mode: "insensitive" } }
    ];
  }

  // Common condition for metrics (scoped to active or trash view)
  const baseViewWhere: Prisma.LeadWhereInput =
    view === "trash" ? { deletedAt: { not: null } } : { deletedAt: null };

  const [
    totalCount,
    dbLeads,
    newCount,
    contactedCount,
    quotationSentCount,
    confirmedCount,
    completedCount,
    lostCancelledCount,
    quoteOnlyCount,
    cashCount,
    bankTransferCount,
    trashCount
  ] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.lead.count({ where: { ...baseViewWhere, status: "new" } }),
    prisma.lead.count({ where: { ...baseViewWhere, status: "contacted" } }),
    prisma.lead.count({ where: { ...baseViewWhere, status: "quotation_sent" } }),
    prisma.lead.count({ where: { ...baseViewWhere, status: "confirmed" } }),
    prisma.lead.count({ where: { ...baseViewWhere, status: "completed" } }),
    prisma.lead.count({ where: { ...baseViewWhere, status: "lost_cancelled" } }),
    prisma.lead.count({ where: { ...baseViewWhere, requestType: "quote" } }),
    prisma.lead.count({ where: { ...baseViewWhere, paymentMethod: "cash" } }),
    prisma.lead.count({ where: { ...baseViewWhere, paymentMethod: "bank_transfer" } }),
    prisma.lead.count({ where: { deletedAt: { not: null } } })
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
    requestType: (l.requestType as Lead["requestType"]) ?? "quote",
    paymentMethod: (l.paymentMethod as Lead["paymentMethod"]) ?? undefined,
    paymentStatus: (l.paymentStatus as Lead["paymentStatus"]) ?? undefined,
    amount: l.amount ?? undefined,
    currency: l.currency ?? "AED",
    transactionRef: l.transactionRef ?? undefined,
    bankDetails: (l.bankDetails as unknown as BankTransferDetails) ?? undefined,
    utmSource: l.utmSource ?? undefined,
    utmMedium: l.utmMedium ?? undefined,
    utmCampaign: l.utmCampaign ?? undefined,
    utmContent: l.utmContent ?? undefined,
    fbclid: l.fbclid ?? undefined,
    landingUrl: l.landingUrl ?? undefined,
    status: l.status as Lead["status"],
    adminNotes: l.adminNotes ?? undefined,
    deletedAt: l.deletedAt ? l.deletedAt.toISOString() : undefined,
    createdAt: l.createdAt.toISOString()
  }));

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6">
      <AdminPageHeader
        title="Leads Inbox & CRM Pipeline"
        description="Manage inbound quote inquiries, paid bookings, cash on delivery, and bank transfers with server-side pagination."
      />

      <LeadsClient
        leads={serializedLeads}
        totalCount={totalCount}
        currentPage={page}
        pageSize={pageSize}
        searchValue={search}
        statusFilter={status}
        paymentMethodFilter={paymentMethod}
        startDateFilter={startDate}
        endDateFilter={endDate}
        viewFilter={view}
        trashCount={trashCount}
        metrics={{
          total: allTotalCount,
          new: newCount,
          contacted: contactedCount,
          quotation_sent: quotationSentCount,
          confirmed: confirmedCount,
          completed: completedCount,
          lost_cancelled: lostCancelledCount,
          quotesCount: quoteOnlyCount,
          cashCount,
          bankTransferCount
        }}
      />
    </div>
  );
}
