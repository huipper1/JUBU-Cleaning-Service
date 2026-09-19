import type { CreateLeadInput, LeadServiceResult } from "@/types/lead";

export interface LeadService {
  create(lead: CreateLeadInput): Promise<LeadServiceResult>;
}
