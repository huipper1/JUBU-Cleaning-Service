import type { CreateLeadInput, LeadServiceResult } from "@/types/lead";

import { createLeadInputSchema } from "@/lib/content/types";

import type { LeadService } from "./lead-service";

export class MockLeadService implements LeadService {
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

    // DUMMY: Log lead data to console as stub service
    console.info("[MockLeadService] New lead created:", {
      id: `lead_${Date.now()}`,
      ...validData,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: "Your request has been received. Our team will contact you shortly!",
      id: `lead_${Date.now()}`
    };
  }
}

export const mockLeadService = new MockLeadService();
