export type LeadStatus = "pending" | "contacted" | "closed";

export interface Lead {
  id: string;
  fullName: string;
  mobile: string;
  whatsappNumber?: string;
  serviceId: string;
  location?: string;
  propertyType?: string;
  preferredDate?: string;
  message?: string;
  whatsappOptIn: boolean;
  sourceArea?: string;
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
  whatsappNumber?: string;
  serviceId: string;
  location?: string;
  propertyType?: string;
  preferredDate?: string;
  message?: string;
  whatsappOptIn?: boolean;
  honeypot?: string;
  sourceArea?: string;
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
