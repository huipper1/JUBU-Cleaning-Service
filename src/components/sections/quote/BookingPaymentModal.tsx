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

import { trackBookingConfirmed } from "@/lib/analytics/data-layer";
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

      // 3. Fire Google Ads & Meta Pixel DataLayer Conversion Event
      trackBookingConfirmed({
        serviceId,
        serviceName,
        locationArea: leadFormData.location || "Dubai",
        propertyType: leadFormData.propertyType,
        preferredDate: leadFormData.preferredDate,
        preferredTime: leadFormData.preferredTime,
        fullName: leadFormData.fullName,
        mobile: leadFormData.mobile,
        amount,
        currency,
        paymentMethod: selectedMethod,
        sourceArea: leadFormData.sourceArea || "booking-modal"
      });

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
      <DialogContent className="max-h-[96vh] w-[calc(100vw-1.5rem)] max-w-lg lg:max-w-4xl overflow-y-auto lg:overflow-visible overflow-x-hidden rounded-2xl border-white/20 bg-[#081839]/98 p-0 text-white shadow-2xl backdrop-blur-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Modal Top Header with Price Badge */}
        <div className="border-b border-white/10 bg-gradient-to-r from-blue-950/90 via-[#0a234f] to-blue-950/90 px-4 py-3 sm:px-6 sm:py-3.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-brand-green">
                  <Sparkles className="size-3 shrink-0" />
                  <span>Instant Service Booking</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400">•</span>
                <span className="hidden sm:inline-block text-[11px] text-slate-300">
                  {serviceName}
                </span>
              </div>
              <DialogTitle className="mt-0.5 text-base font-extrabold text-white sm:text-xl">
                Choose Payment Method
              </DialogTitle>
              <DialogDescription className="sr-only">
                Complete booking and payment for {serviceName}
              </DialogDescription>
            </DialogHeader>

            {/* Price Badge */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 shadow-inner">
              <span className="text-[11px] font-medium text-slate-300">Total:</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-brand-green sm:text-xl leading-none">
                  {amount} {currency}
                </span>
                <span className="text-[10px] text-slate-400">({defaultPricing.unitLabel})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body: Compact single column when Cash is selected, 2-column when Bank Transfer is selected */}
        <div className="p-4 sm:p-5 lg:p-6">
          {selectedMethod === "cash" ? (
            /* Cash Payment View: Clean, Compact, Zero Scroll, Centered */
            <div className="mx-auto flex max-w-md flex-col gap-3.5">
              <div>
                <label className="mb-2 block text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: Cash Payment (Active) */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("cash")}
                    className="relative flex cursor-pointer items-start gap-2.5 rounded-xl border border-brand-green bg-brand-green/15 p-3 text-left ring-2 ring-brand-green/40 shadow-md shadow-brand-green/10"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/20 text-brand-green">
                      <Banknote className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="block text-xs sm:text-sm font-bold text-white">Cash</span>
                        <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
                          <Check className="size-2.5" />
                        </div>
                      </div>
                      <span className="mt-0.5 block text-[10px] sm:text-[11px] text-slate-300 leading-tight">
                        Pay on completion
                      </span>
                    </div>
                  </button>

                  {/* Option 2: Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("bank_transfer")}
                    className="relative flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/15 bg-white/5 p-3 text-left transition-all duration-200 hover:border-white/30 hover:bg-white/10"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-sky/20 text-brand-sky">
                      <CreditCard className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs sm:text-sm font-bold text-white">Bank Transfer</span>
                      <span className="mt-0.5 block text-[10px] sm:text-[11px] text-slate-300 leading-tight">
                        Direct UAE transfer
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Cash Policy Info */}
              <div className="rounded-xl border border-white/15 bg-white/5 p-3">
                <div className="flex items-start gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green mt-0.5">
                    <ShieldCheck className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white">Zero Advance Payment</h4>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">
                      Pay directly in cash to cleaners upon service completion. Official receipt will be provided on-site.
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] text-slate-300">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Client:</span>
                    <span className="font-semibold text-white truncate block">{leadFormData.fullName || "Valued Customer"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location:</span>
                    <span className="font-semibold text-white truncate block">{leadFormData.location || "Dubai"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessing || isConfirmed}
                  onClick={handleConfirmBooking}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand-green-hover hover:shadow-brand-green/30 active:scale-98 disabled:cursor-not-allowed disabled:opacity-70"
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
                    <span>
                      Confirm Booking ({amount} {currency} — Cash)
                    </span>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400">
                  <Lock className="size-3 shrink-0" />
                  <span>100% satisfaction guarantee. Free cancellation.</span>
                </div>
              </div>
            </div>
          ) : (
            /* Bank Transfer View: 2-Column Responsive Layout */
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6 lg:items-start">
              {/* Left Column: Method Selection & Actions */}
              <div className="flex flex-col gap-3.5 lg:col-span-5">
                <div>
                  <label className="mb-2 block text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Option 1: Cash Payment */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("cash")}
                      className="relative flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/15 bg-white/5 p-3 text-left transition-all duration-200 hover:border-white/30 hover:bg-white/10"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/20 text-brand-green">
                        <Banknote className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-white">Cash</span>
                        <span className="mt-0.5 block text-[10px] sm:text-[11px] text-slate-300 leading-tight">
                          Pay on service
                        </span>
                      </div>
                    </button>

                    {/* Option 2: Bank Transfer (Active) */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod("bank_transfer")}
                      className="relative flex cursor-pointer items-start gap-2.5 rounded-xl border border-brand-sky bg-brand-sky/15 ring-2 ring-brand-sky/40 shadow-md shadow-brand-sky/10 p-3 text-left"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-sky/20 text-brand-sky">
                        <CreditCard className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="block text-xs sm:text-sm font-bold text-white">Bank</span>
                          <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-sky text-white">
                            <Check className="size-2.5" />
                          </div>
                        </div>
                        <span className="mt-0.5 block text-[10px] sm:text-[11px] text-slate-300 leading-tight">
                          Direct UAE transfer
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Booking Summary Box */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] text-slate-300">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Client:</span>
                      <span className="font-semibold text-white truncate block">{leadFormData.fullName || "Valued Customer"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location:</span>
                      <span className="font-semibold text-white truncate block">{leadFormData.location || "Dubai"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isProcessing || isConfirmed}
                    onClick={handleConfirmBooking}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg transition-all duration-200 hover:bg-brand-green-hover hover:shadow-brand-green/30 active:scale-98 disabled:cursor-not-allowed disabled:opacity-70"
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
                      <span>
                        Confirm Booking ({amount} {currency} — Bank Transfer)
                      </span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400">
                    <Lock className="size-3 shrink-0" />
                    <span>100% satisfaction guarantee. Free cancellation.</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Bank Details & Reference */}
              <div className="flex flex-col gap-3 lg:col-span-7">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                    Account Details ({activeBankDetails.bankName})
                  </span>
                  <span className="text-[10px] text-brand-sky font-medium">Click icon to copy</span>
                </div>

                {/* Compact Bank Details Card */}
                <div className="overflow-hidden rounded-xl border border-white/15 bg-white/10 shadow-md">
                  <div className="divide-y divide-white/10 text-xs">
                    {/* Bank & Swift Row */}
                    <div className="grid grid-cols-2 divide-x divide-white/10">
                      <div className="p-2 sm:p-2.5">
                        <span className="font-medium text-slate-400 text-[10px] block">Bank</span>
                        <span className="font-semibold text-white text-xs truncate block">
                          {activeBankDetails.bankName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-2.5">
                        <div>
                          <span className="font-medium text-slate-400 text-[10px] block">Swift Code</span>
                          <span className="font-mono font-bold text-brand-sky text-xs">
                            {activeBankDetails.swiftCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy("Swift code", activeBankDetails.swiftCode)}
                          title="Copy Swift Code"
                          className="rounded-md border border-white/15 bg-white/10 p-1 text-slate-300 hover:bg-white/20 active:scale-95"
                        >
                          {copiedField === "Swift code" ? (
                            <Check className="size-3 text-brand-green" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* IBAN */}
                    <div className="flex items-center justify-between gap-1.5 p-2 sm:p-2.5">
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-slate-400 text-[10px] block">IBAN Number</span>
                        <span className="font-mono font-bold text-brand-sky text-xs truncate block">
                          {activeBankDetails.iban}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy("IBAN", activeBankDetails.iban.replace(/\s+/g, ""))
                        }
                        title="Copy IBAN"
                        className="rounded-md border border-white/15 bg-white/10 p-1.5 text-slate-300 hover:bg-white/20 active:scale-95 shrink-0"
                      >
                        {copiedField === "IBAN" ? (
                          <Check className="size-3.5 text-brand-green" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Account Number & Routing */}
                    <div className="grid grid-cols-2 divide-x divide-white/10">
                      <div className="flex items-center justify-between p-2 sm:p-2.5">
                        <div className="min-w-0">
                          <span className="font-medium text-slate-400 text-[10px] block">Account #</span>
                          <span className="font-mono font-bold text-brand-sky text-xs truncate block">
                            {activeBankDetails.accountNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy("Account number", activeBankDetails.accountNumber)
                          }
                          title="Copy Account Number"
                          className="rounded-md border border-white/15 bg-white/10 p-1 text-slate-300 hover:bg-white/20 active:scale-95"
                        >
                          {copiedField === "Account number" ? (
                            <Check className="size-3 text-brand-green" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2 sm:p-2.5">
                        <div className="min-w-0">
                          <span className="font-medium text-slate-400 text-[10px] block">Routing #</span>
                          <span className="font-mono font-bold text-brand-sky text-xs truncate block">
                            {activeBankDetails.routingNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy("Routing number", activeBankDetails.routingNumber)
                          }
                          title="Copy Routing Number"
                          className="rounded-md border border-white/15 bg-white/10 p-1 text-slate-300 hover:bg-white/20 active:scale-95"
                        >
                          {copiedField === "Routing number" ? (
                            <Check className="size-3 text-brand-green" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compact Reference inputs */}
                <div className="grid grid-cols-1 gap-2 rounded-xl border border-white/15 bg-white/5 p-2.5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="senderAccountName"
                      className="text-[10px] font-semibold text-slate-300 block mb-1"
                    >
                      Sender Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="senderAccountName"
                      value={senderAccountName}
                      onChange={(e) => setSenderAccountName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-brand-sky focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="transactionRef"
                      className="text-[10px] font-semibold text-slate-300 block mb-1"
                    >
                      Transfer Ref # (Optional)
                    </label>
                    <input
                      type="text"
                      id="transactionRef"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. FT2600123"
                      className="w-full rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-brand-sky focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
