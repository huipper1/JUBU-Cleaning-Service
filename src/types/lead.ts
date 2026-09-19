export type LeadStatus = "pending" | "contacted" | "closed";

export interface Lead {
  id: string;
  fullName: string;
  mobile: string;
  serviceId: string;
  message?: string;
  whatsappOptIn: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  landingUrl?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface CreateLeadInput {
  fullName: string;
  mobile: string;
  serviceId: string;
  message?: string;
  whatsappOptIn?: boolean;
  honeypot?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  landingUrl?: string;
}

export interface LeadServiceResult {
  success: boolean;
  message: string;
  id?: string;
  errors?: Record<string, string[]>;
}
