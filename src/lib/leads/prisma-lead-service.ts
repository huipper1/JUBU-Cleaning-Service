import type { Prisma } from "@prisma/client";

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

    // Format add-ons summary if customer personalized the service
    let finalMessage = validData.message ?? null;
    if (validData.addonsBreakdown && validData.addonsBreakdown.length > 0) {
      const addonsSummary = validData.addonsBreakdown
        .map((a) => `${a.name} x${a.quantity} (+${a.total} AED)`)
        .join(", ");
      finalMessage = validData.message
        ? `[Customized: ${addonsSummary}] - ${validData.message}`
        : `[Customized: ${addonsSummary}]`;
    }

    const mergedDetails = {
      ...((validData.bankDetails as Record<string, unknown>) ?? {}),
      ...(validData.addonsBreakdown && validData.addonsBreakdown.length > 0
        ? { addonsBreakdown: validData.addonsBreakdown }
        : {})
    };

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
          preferredTime: validData.preferredTime ?? null,
          message: finalMessage,
          whatsappOptIn: validData.whatsappOptIn ?? true,
          sourceArea: validData.sourceArea ?? "main-page",
          requestType: validData.requestType ?? "quote",
          paymentMethod: validData.paymentMethod ?? null,
          paymentStatus:
            validData.paymentStatus ??
            (validData.paymentMethod === "cash"
              ? "cash_on_delivery"
              : validData.paymentMethod === "bank_transfer"
                ? "pending"
                : null),
          amount: validData.amount ?? null,
          currency: validData.currency ?? "AED",
          transactionRef: validData.transactionRef ?? null,
          bankDetails:
            Object.keys(mergedDetails).length > 0
              ? (mergedDetails as Prisma.InputJsonValue)
              : undefined,
          utmSource: validData.utmSource ?? null,
          utmMedium: validData.utmMedium ?? null,
          utmCampaign: validData.utmCampaign ?? null,
          utmContent: validData.utmContent ?? null,
          fbclid: validData.fbclid ?? null,
          landingUrl: validData.landingUrl ?? null,
          status: "new"
        }
      });

      return {
        success: true,
        message:
          validData.requestType === "booking"
            ? "Your booking has been placed successfully! Our team will contact you to confirm."
            : "Your quote request has been received. Our team will contact you shortly!",
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
