import { prisma } from "@/lib/db/prisma";
import type { Lead } from "@/types/lead";
import { LeadsClient } from "./LeadsClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const dbLeads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" }
  });

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
    createdAt: l.createdAt.toISOString()
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Leads Inbox & CRM Pipeline</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage inbound quote inquiries, follow-ups, and operational notes.
        </p>
      </div>

      <LeadsClient initialLeads={serializedLeads} />
    </div>
  );
}
