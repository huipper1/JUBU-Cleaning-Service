import type { BankTransferDetails } from "@/types/lead";

/**
 * Service standard base pricing in AED.
 * Used for dynamic calculation and display on the booking modal and buttons.
 */
export const SERVICE_BASE_PRICES: Record<string, { basePrice: number; unitLabel: string }> = {
  "home-cleaning": { basePrice: 199, unitLabel: "Standard Session" },
  "deep-cleaning": { basePrice: 349, unitLabel: "Full Deep Clean" },
  "office-cleaning": { basePrice: 299, unitLabel: "Commercial Session" },
  "sofa-carpet-cleaning": { basePrice: 249, unitLabel: "Upholstery Care" },
  "post-construction-cleaning": { basePrice: 499, unitLabel: "Post-Renovation Clean" },
  "move-in-move-out-cleaning": { basePrice: 399, unitLabel: "Tenancy Handover" },
  other: { basePrice: 199, unitLabel: "Custom Service" }
};

export const DEFAULT_BOOKING_PRICE = 199;

/**
 * Emirates NBD Bank details directly provided in system screenshot.
 */
export const ADMIN_BANK_DETAILS: BankTransferDetails = {
  bankName: "Emirates NBD",
  iban: "AE56 0260 0001 2595 4738 201",
  accountNumber: "0125954738201",
  swiftCode: "EBILAEAD",
  routingNumber: "302620122",
  accountOpeningDate: "11/01/2026"
};
