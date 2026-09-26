import { env } from "@/env";
import type { LeadService } from "./lead-service";
import { mockLeadService } from "./mock-lead-service";
import { prismaLeadService } from "./prisma-lead-service";

export const leadService: LeadService =
  env.CONTENT_SOURCE === "prisma" ? prismaLeadService : mockLeadService;

export * from "./lead-service";
export * from "./mock-lead-service";
