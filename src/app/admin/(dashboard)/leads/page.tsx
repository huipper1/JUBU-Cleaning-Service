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
  }>;
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const pageSize = 10;
  const search = resolvedParams.search || "";
  const status = resolvedParams.status || "all";
  const paymentMethod = resolvedParams.paymentMethod || "all";

  // Build prisma filter
  const where: Prisma.LeadWhereInput = {};
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
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { mobile: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { sourceArea: { contains: search, mode: "insensitive" } },
      { transactionRef: { contains: search, mode: "insensitive" } }
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
    lostCancelledCount,
    quoteOnlyCount,
    cashCount,
    bankTransferCount
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
    prisma.lead.count({ where: { status: "lost_cancelled" } }),
    prisma.lead.count({ where: { requestType: "quote" } }),
    prisma.lead.count({ where: { paymentMethod: "cash" } }),
    prisma.lead.count({ where: { paymentMethod: "bank_transfer" } })
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
