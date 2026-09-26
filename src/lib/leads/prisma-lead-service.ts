import type { CreateLeadInput, LeadServiceResult } from "@/types/lead";
import { createLeadInputSchema } from "@/lib/content/types";
import { prisma } from "@/lib/db/prisma";
import type { LeadService } from "./lead-service";

export class PrismaLeadService implements LeadService {
  async create(lead: CreateLeadInput): Promise<LeadServiceResult> {
    const parseResult = createLeadInputSchema.safeParse(lead);

    if (!parseResult.success) {
      return {
        success: false,
        message: "Validation failed for lead submission",
        errors: parseResult.error.flatten().fieldErrors
      };
    }

    const validData = parseResult.data;

    // Honeypot spam check
    if (validData.honeypot && validData.honeypot.length > 0) {
      return {
        success: false,
        message: "Invalid submission"
      };
    }

    try {
      const created = await prisma.lead.create({
        data: {
          fullName: validData.fullName,
          mobile: validData.mobile,
          whatsappNumber: validData.whatsappNumber ?? null,
          serviceId: validData.serviceId,
          location: validData.location ?? null,
          propertyType: validData.propertyType ?? null,
          preferredDate: validData.preferredDate ?? null,
          message: validData.message ?? null,
          whatsappOptIn: validData.whatsappOptIn ?? true,
          sourceArea: validData.sourceArea ?? "main-page",
          utmSource: validData.utmSource ?? null,
          utmMedium: validData.utmMedium ?? null,
          utmCampaign: validData.utmCampaign ?? null,
          utmContent: validData.utmContent ?? null,
          fbclid: validData.fbclid ?? null,
          landingUrl: validData.landingUrl ?? null,
          status: "pending"
        }
      });

      return {
        success: true,
        message: "Your request has been received. Our team will contact you shortly!",
        id: created.id
      };
    } catch (error) {
      console.error("[PrismaLeadService] Failed to insert lead:", error);
      return {
        success: false,
        message: "Failed to submit request. Please try contacting us via WhatsApp directly."
      };
    }
  }
}

export const prismaLeadService = new PrismaLeadService();
