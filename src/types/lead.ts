export type LeadStatus =
  | "new"
  | "contacted"
  | "quotation_sent"
  | "confirmed"
  | "completed"
  | "lost_cancelled";

export type RequestType = "quote" | "booking";

export type PaymentMethod = "cash" | "bank_transfer";

export type PaymentStatus = "pending" | "paid" | "cash_on_delivery" | "cancelled";

export interface BankTransferDetails {
  bankName: string;
  iban: string;
  accountNumber: string;
  swiftCode: string;
  routingNumber: string;
  accountOpeningDate?: string;
  transactionRef?: string;
  senderAccountName?: string;
}

export interface Lead {
  id: string;
  fullName: string;
  mobile: string;
  whatsappNumber?: string;
  serviceId: string;
  location?: string;
  propertyType?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  whatsappOptIn: boolean;
  sourceArea?: string;

  // Booking & Payment Information
  requestType: RequestType;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  amount?: number;
  currency?: string;
  transactionRef?: string;
  bankDetails?: BankTransferDetails | Record<string, unknown>;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  landingUrl?: string;
  status: LeadStatus;
  adminNotes?: string;
  deletedAt?: string;
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
  preferredTime?: string;
  message?: string;
  whatsappOptIn?: boolean;
  honeypot?: string;
  sourceArea?: string;

  // Booking & Payment Information
  requestType?: RequestType;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  amount?: number;
  currency?: string;
  transactionRef?: string;
  bankDetails?: BankTransferDetails | Record<string, unknown>;

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
