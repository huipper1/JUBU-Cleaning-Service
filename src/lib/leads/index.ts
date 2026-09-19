import type { LeadService } from "./lead-service";
import { mockLeadService } from "./mock-lead-service";

export const leadService: LeadService = mockLeadService;

export * from "./lead-service";
export * from "./mock-lead-service";
