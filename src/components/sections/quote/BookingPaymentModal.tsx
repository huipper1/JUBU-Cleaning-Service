"use client";

import * as React from "react";
import {
  Banknote,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

import { ADMIN_BANK_DETAILS, SERVICE_BASE_PRICES } from "@/constants/payment";
import type { BankTransferDetails, CreateLeadInput, PaymentMethod } from "@/types/lead";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface BookingPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
  serviceName: string;
  basePrice?: number;
  bankDetails?: Partial<BankTransferDetails>;
  leadFormData: CreateLeadInput;
  whatsappNumber: string;
  onSuccessSubmit: (payload: CreateLeadInput, redirectUrl: string) => void;
}

export function BookingPaymentModal({
  open,
  onOpenChange,
  serviceId,
  serviceName,
  basePrice,
  bankDetails: customBankDetails,
  leadFormData,
  whatsappNumber,
  onSuccessSubmit
}: BookingPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("cash");
  const [transactionRef, setTransactionRef] = React.useState<string>("");
  const [senderAccountName, setSenderAccountName] = React.useState<string>("");
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);

  // Dynamic service price lookup (custom basePrice from admin catalog takes top precedence)
  const defaultPricing = SERVICE_BASE_PRICES[serviceId] ?? SERVICE_BASE_PRICES["other"]!;
  const amount = basePrice !== undefined && basePrice > 0 ? basePrice : defaultPricing.basePrice;
  const currency = "AED";

  // Active bank details merging admin settings with default Emirates NBD
  const activeBankDetails: BankTransferDetails = {
    bankName: customBankDetails?.bankName || ADMIN_BANK_DETAILS.bankName,
    iban: customBankDetails?.iban || ADMIN_BANK_DETAILS.iban,
    accountNumber: customBankDetails?.accountNumber || ADMIN_BANK_DETAILS.accountNumber,
    swiftCode: customBankDetails?.swiftCode || ADMIN_BANK_DETAILS.swiftCode,
    routingNumber: customBankDetails?.routingNumber || ADMIN_BANK_DETAILS.routingNumber,
    accountOpeningDate: customBankDetails?.accountOpeningDate || ADMIN_BANK_DETAILS.accountOpeningDate
  };

  const handleCopy = (field: string, text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    }
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);

    try {
      const fullBookingPayload: CreateLeadInput = {
        ...leadFormData,
        requestType: "booking",
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === "cash" ? "cash_on_delivery" : "pending",
        amount,
        currency,
        transactionRef: selectedMethod === "bank_transfer" ? transactionRef.trim() : undefined,
        bankDetails:
          selectedMethod === "bank_transfer"
            ? {
                ...activeBankDetails,
                transactionRef: transactionRef.trim(),
                senderAccountName: senderAccountName.trim()
              }
            : undefined
      };

      // 1. Submit booking to API
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullBookingPayload),
        keepalive: true
      });

      if (!res.ok) {
        throw new Error("Failed to submit booking");
      }

      // 2. Prepare WhatsApp notification text for customer convenience
      const paymentMethodLabel =
        selectedMethod === "cash"
          ? "Cash on Service Delivery (Pay at Location)"
          : `Bank Transfer (${activeBankDetails.bankName}) - Ref: ${transactionRef.trim() || "Pending"}`;

      const waBookingMsg = [
        `*New Instant Booking & Payment Order - JUBU Cleaning*`,
        `Name: ${leadFormData.fullName}`,
        `Phone: ${leadFormData.mobile}`,
        `Service: ${serviceName}`,
        `Total Amount: ${amount} ${currency}`,
        `Payment Method: ${paymentMethodLabel}`,
        `Location: ${leadFormData.location || "N/A"}`,
        `Preferred Date: ${leadFormData.preferredDate || "N/A"}`,
        `Preferred Time: ${leadFormData.preferredTime || "N/A"}`,
        leadFormData.message ? `Details: ${leadFormData.message}` : ""
      ]
        .filter(Boolean)
        .join("\n");

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waBookingMsg)}`;

      setIsConfirmed(true);
      toast.success("Booking placed successfully!");

      setTimeout(() => {
        onSuccessSubmit(fullBookingPayload, waUrl);
      }, 700);
    } catch (err: unknown) {
      console.error("[BookingPaymentModal] Booking failed:", err);
      toast.error("An error occurred while confirming your booking. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94vh] w-[calc(100vw-1rem)] max-w-lg sm:max-w-xl overflow-y-auto overflow-x-hidden rounded-2xl border-white/20 bg-[#081839]/98 p-0 text-white shadow-2xl backdrop-blur-2xl">
        {/* Modal Top Header with Price Badge */}
        <div className="border-b border-white/10 bg-gradient-to-r from-blue-950/90 via-[#0a234f] to-blue-950/90 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <DialogHeader className="text-left">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-brand-green">
                <Sparkles className="size-3 shrink-0" />
                <span>Instant Service Booking</span>
              </div>
              <DialogTitle className="mt-1.5 text-lg font-extrabold text-white sm:text-2xl">
                Choose Payment Method
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-slate-300 sm:text-sm">
                Complete booking for{" "}
                <span className="font-semibold text-brand-sky">{serviceName}</span>
              </DialogDescription>
            </DialogHeader>

            {/* Price Badge */}
            <div className="flex items-center justify-between sm:flex-col sm:items-end rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-inner">
              <span className="text-[11px] font-medium text-slate-300">Total Price</span>
              <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-end sm:gap-0">
                <span className="text-lg font-extrabold text-brand-green sm:text-2xl leading-none">
                  {amount} {currency}
                </span>
                <span className="text-[10px] text-slate-400">{defaultPricing.unitLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-4 sm:p-6">
          {/* Method Selection Tabs */}
          <div>
            <label className="mb-2 block text-[11px] sm:text-xs font-bold tracking-wider text-slate-300 uppercase">
              1. Select How You Want to Pay
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {/* Option 1: Cash Payment */}
              <button
                type="button"
                onClick={() => setSelectedMethod("cash")}
                className={`relative flex cursor-pointer items-start sm:flex-col gap-3 rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 ${
                  selectedMethod === "cash"
                    ? "border-brand-green bg-brand-green/15 ring-2 ring-brand-green/40 shadow-md shadow-brand-green/10"
                    : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/20 text-brand-green">
                  <Banknote className="size-4 sm:size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-white">Cash Payment</span>
                    {selectedMethod === "cash" && (
                      <div className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-white shadow-xs">
                        <Check className="size-3 sm:size-3.5" />
                      </div>
                    )}
                  </div>
                  <span className="mt-0.5 sm:mt-1 block text-[11px] sm:text-xs text-slate-300 leading-snug">
                    Pay directly in cash to cleaners upon completion of service.
                  </span>
                </div>
              </button>

              {/* Option 2: Bank Transfer */}
              <button
                type="button"
                onClick={() => setSelectedMethod("bank_transfer")}
                className={`relative flex cursor-pointer items-start sm:flex-col gap-3 rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-200 ${
                  selectedMethod === "bank_transfer"
                    ? "border-brand-sky bg-brand-sky/15 ring-2 ring-brand-sky/40 shadow-md shadow-brand-sky/10"
                    : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-brand-sky/20 text-brand-sky">
                  <CreditCard className="size-4 sm:size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="block text-sm font-bold text-white">Bank Transfer</span>
                    {selectedMethod === "bank_transfer" && (
                      <div className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-brand-sky text-white shadow-xs">
                        <Check className="size-3 sm:size-3.5" />
                      </div>
                    )}
                  </div>
                  <span className="mt-0.5 sm:mt-1 block text-[11px] sm:text-xs text-slate-300 leading-snug">
                    Instant transfer to official UAE account ({activeBankDetails.bankName}).
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional View: Cash Payment Explainer */}
          {selectedMethod === "cash" && (
            <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-white/5 p-3.5 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green mt-0.5">
                  <ShieldCheck className="size-3.5 sm:size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white">Cash on Delivery Policy</h4>
                  <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-slate-300">
                    No advance payment required. Our vetted cleaners will inspect and complete the work
                    to your satisfaction, and provide an official receipt upon receiving cash payment of{" "}
                    <strong className="text-white font-extrabold">
                      {amount} {currency}
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conditional View: Bank Transfer Details */}
          {selectedMethod === "bank_transfer" && (
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold tracking-wider text-slate-300 uppercase">
                  2. Bank Transfer Details
                </span>
                <span className="text-[10px] sm:text-[11px] text-brand-sky font-medium">Tap icon to copy</span>
              </div>

              {/* Bank Details Card */}
              <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 shadow-lg">
                <div className="divide-y divide-white/10 text-xs sm:text-sm">
                  {/* Bank Name */}
                  <div className="flex flex-wrap items-center justify-between gap-1 p-3 sm:p-4">
                    <span className="font-medium text-slate-300 text-[11px] sm:text-xs">Bank</span>
                    <span className="font-semibold text-white text-xs sm:text-sm">
                      {activeBankDetails.bankName}
                    </span>
                  </div>

                  {/* IBAN */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-3 sm:p-4">
                    <span className="font-medium text-slate-300 text-[11px] sm:text-xs">IBAN</span>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span className="font-mono font-bold text-brand-sky text-xs sm:text-sm break-all">
                        {activeBankDetails.iban}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy("IBAN", activeBankDetails.iban.replace(/\s+/g, ""))
                        }
                        title="Copy IBAN"
                        className="rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white shrink-0 active:scale-95"
                      >
                        {copiedField === "IBAN" ? (
                          <Check className="size-3.5 sm:size-4 text-brand-green" />
                        ) : (
                          <Copy className="size-3.5 sm:size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                    <span className="font-medium text-slate-300 text-[11px] sm:text-xs">Account number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-sky text-xs sm:text-sm">
                        {activeBankDetails.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy("Account number", activeBankDetails.accountNumber)
                        }
                        title="Copy Account Number"
                        className="rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white shrink-0 active:scale-95"
                      >
                        {copiedField === "Account number" ? (
                          <Check className="size-3.5 sm:size-4 text-brand-green" />
                        ) : (
                          <Copy className="size-3.5 sm:size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Swift Code */}
                  <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                    <span className="font-medium text-slate-300 text-[11px] sm:text-xs">Swift code</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-sky text-xs sm:text-sm">
                        {activeBankDetails.swiftCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy("Swift code", activeBankDetails.swiftCode)}
                        title="Copy Swift Code"
                        className="rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white shrink-0 active:scale-95"
                      >
                        {copiedField === "Swift code" ? (
                          <Check className="size-3.5 sm:size-4 text-brand-green" />
                        ) : (
                          <Copy className="size-3.5 sm:size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Routing Number */}
                  <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
                    <span className="font-medium text-slate-300 text-[11px] sm:text-xs">Routing number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-sky text-xs sm:text-sm">
                        {activeBankDetails.routingNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy("Routing number", activeBankDetails.routingNumber)
                        }
                        title="Copy Routing Number"
                        className="rounded-lg border border-white/15 bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-white/20 hover:text-white shrink-0 active:scale-95"
                      >
                        {copiedField === "Routing number" ? (
                          <Check className="size-3.5 sm:size-4 text-brand-green" />
                        ) : (
                          <Copy className="size-3.5 sm:size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional User Proof Reference & Sender Account Name */}
              <div className="grid grid-cols-1 gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-white/15 bg-white/5 p-3.5 sm:p-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="senderAccountName"
                    className="text-[11px] sm:text-xs font-semibold text-slate-200"
                  >
                    Sender Account Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="senderAccountName"
                    value={senderAccountName}
                    onChange={(e) => setSenderAccountName(e.target.value)}
                    placeholder="e.g. John Doe / Account title"
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder:text-slate-400 focus:border-brand-sky focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="transactionRef"
                    className="text-[11px] sm:text-xs font-semibold text-slate-200"
                  >
                    Transfer Ref / Transaction # (Optional)
                  </label>
                  <input
                    type="text"
                    id="transactionRef"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. FT26001234567"
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder:text-slate-400 focus:border-brand-sky focus:outline-none"
                  />
                </div>

                <div className="col-span-full">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 leading-tight block">
                    After initiating the transfer, you can also share the payment slip directly via WhatsApp.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-1 flex flex-col gap-2.5 sm:gap-3">
            <button
              type="button"
              disabled={isProcessing || isConfirmed}
              onClick={handleConfirmBooking}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-green px-5 py-3.5 sm:px-6 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand-green-hover hover:shadow-brand-green/30 active:scale-98 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin shrink-0" />
                  <span>Confirming Booking...</span>
                </>
              ) : isConfirmed ? (
                <>
                  <CheckCircle2 className="size-4 shrink-0 text-white" />
                  <span>Booking Confirmed!</span>
                </>
              ) : (
                <>
                  <span className="text-center">
                    Confirm Booking ({amount} {currency} —{" "}
                    {selectedMethod === "cash" ? "Cash" : "Bank Transfer"})
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-center text-[10px] sm:text-[11px] text-slate-400">
              <Lock className="size-3 sm:size-3.5 shrink-0" />
              <span>
                100% satisfaction guarantee. Free cancellation up to 4h before arrival.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
