"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

import type { Lead, LeadStatus } from "@/types/lead";

import { cn } from "@/lib/utils";

import { AdminDataTable, ColumnDef } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { updateLeadStatusAction } from "./actions";

const STATUS_OPTIONS: {
  id: LeadStatus;
  label: string;
  badgeClass: string;
  cardClass: string;
}[] = [
    {
      id: "new",
      label: "New",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      cardClass: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "contacted",
      label: "Contacted",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      cardClass: "text-amber-600 dark:text-amber-400"
    },
    {
      id: "quotation_sent",
      label: "Quotation Sent",
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      cardClass: "text-purple-600 dark:text-purple-400"
    },
    {
      id: "confirmed",
      label: "Confirmed",
      badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      cardClass: "text-cyan-600 dark:text-cyan-400"
    },
    {
      id: "completed",
      label: "Completed",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      cardClass: "text-emerald-600 dark:text-emerald-400"
    },
    {
      id: "lost_cancelled",
      label: "Lost/Cancelled",
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      cardClass: "text-rose-600 dark:text-rose-400"
    }
  ];

interface LeadsClientProps {
  leads: Lead[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchValue: string;
  statusFilter: string;
  paymentMethodFilter?: string;
  metrics: {
    total: number;
    new: number;
    contacted: number;
    quotation_sent: number;
    confirmed: number;
    completed: number;
    lost_cancelled: number;
    quotesCount?: number;
    cashCount?: number;
    bankTransferCount?: number;
  };
}

export function LeadsClient({
  leads,
  totalCount,
  currentPage,
  pageSize,
  searchValue,
  statusFilter,
  paymentMethodFilter = "all",
  metrics
}: LeadsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localLeads, setLocalLeads] = React.useState<Lead[]>(leads);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

  React.useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const updateQuery = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === "" || ((k === "status" || k === "paymentMethod") && v === "all")) {
        current.delete(k);
      } else {
        current.set(k, v);
      }
    });
    router.push(`${pathname}?${current.toString()}`);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const prev = [...localLeads];
    setLocalLeads(localLeads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    const res = await updateLeadStatusAction(leadId, newStatus);
    if (!res.success) {
      toast.error("Failed to update status");
      setLocalLeads(prev);
    } else {
      const opt = STATUS_OPTIONS.find((s) => s.id === newStatus);
      toast.success(`Lead marked as ${opt?.label ?? newStatus}`);
    }
  };

  const columns: ColumnDef<Lead>[] = [
    {
      header: "Client & Contact",
      cell: (lead) => {
        const cleanPhone = lead.mobile.replace(/\D/g, "");
        const whatsappTarget = cleanPhone.startsWith("0")
          ? `971${cleanPhone.slice(1)}`
          : cleanPhone;

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{lead.fullName}</span>
              {lead.requestType === "booking" ? (
                <Badge className="bg-sky-500/15 text-sky-600 border-sky-500/30 text-[10px] font-bold">
                  BOOKING
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                  QUOTE
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${lead.mobile}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <Phone className="size-3" />
                <span>{lead.mobile}</span>
              </a>
              <a
                href={`https://wa.me/${whatsappTarget}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-emerald-600 hover:underline dark:text-emerald-400"
              >
                <MessageSquare className="size-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        );
      }
    },
    {
      header: "Service & Property",
      cell: (lead) => (
        <div className="flex flex-col gap-0.5">
          <Badge variant="outline" className="w-fit">
            {lead.serviceId}
          </Badge>
          {lead.propertyType && (
            <span className="text-xs text-muted-foreground">Property: {lead.propertyType}</span>
          )}
        </div>
      )
    },
    {
      header: "Payment Details",
      cell: (lead) => {
        if (lead.paymentMethod === "cash") {
          return (
            <div className="flex flex-col gap-1">
              <Badge className="w-fit border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Cash On Delivery
              </Badge>
              <span className="text-xs font-semibold text-foreground">
                {lead.amount ? `${lead.amount} ${lead.currency || "AED"}` : "Pay on Arrival"}
              </span>
            </div>
          );
        }

        if (lead.paymentMethod === "bank_transfer") {
          return (
            <div className="flex flex-col gap-1">
              <Badge className="w-fit border-sky-500/30 bg-sky-500/15 text-sky-600 dark:text-sky-400">
                Bank Transfer
              </Badge>
              <div className="flex flex-col text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {lead.amount ? `${lead.amount} ${lead.currency || "AED"}` : "Emirates NBD"}
                </span>
                {lead.transactionRef && (
                  <span className="truncate max-w-[140px]" title={lead.transactionRef}>
                    Ref: {lead.transactionRef}
                  </span>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Free Quote Inquiry</span>
            <span className="text-[11px] text-muted-foreground italic">No payment</span>
          </div>
        );
      }
    },
    {
      header: "Source / Area",
      cell: (lead) => (
        <div className="flex flex-col gap-0.5">
          <Badge variant="secondary" className="w-fit font-mono text-[11px]">
            {lead.sourceArea ?? "main-page"}
          </Badge>
          {lead.utmSource && (
            <span className="text-[10px] text-muted-foreground">via {lead.utmSource}</span>
          )}
        </div>
      )
    },
    {
      header: "CRM Status",
      className: "min-w-[140px]",
      cell: (lead) => (
        <select
          value={lead.status}
          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
          className="rounded-md border bg-background px-2 py-1 text-xs font-medium text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    },
    {
      header: "Date",
      className: "whitespace-nowrap",
      cell: (lead) => (
        <span className="text-xs text-muted-foreground">
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Action",
      className: "text-right whitespace-nowrap",
      cell: (lead) => (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold"
          onClick={() => {
            setSelectedLead(lead);
          }}
        >
          Details
        </Button>
      )
    }
  ];

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6">
      {/* Primary Channel & Payment Section Tabs */}
      <div className="flex flex-col gap-2 rounded-2xl border bg-card p-4 shadow-xs">
        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Inquiry & Payment Channels
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={paymentMethodFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => updateQuery({ paymentMethod: "all", page: "1" })}
            className="h-9 gap-2 text-xs font-semibold"
          >
            <span>All Leads</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
              {metrics.total}
            </Badge>
          </Button>

          <Button
            variant={paymentMethodFilter === "quote" ? "default" : "outline"}
            size="sm"
            onClick={() => updateQuery({ paymentMethod: "quote", page: "1" })}
            className="h-9 gap-2 text-xs font-semibold"
          >
            <span className="size-2 rounded-full bg-slate-400" />
            <span>Free Quotes (Standard Leads)</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
              {metrics.quotesCount ?? 0}
            </Badge>
          </Button>

          <Button
            variant={paymentMethodFilter === "cash" ? "default" : "outline"}
            size="sm"
            onClick={() => updateQuery({ paymentMethod: "cash", page: "1" })}
            className="h-9 gap-2 text-xs font-semibold"
          >
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Cash On Delivery</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
              {metrics.cashCount ?? 0}
            </Badge>
          </Button>

          <Button
            variant={paymentMethodFilter === "bank_transfer" ? "default" : "outline"}
            size="sm"
            onClick={() => updateQuery({ paymentMethod: "bank_transfer", page: "1" })}
            className="h-9 gap-2 text-xs font-semibold"
          >
            <span className="size-2 rounded-full bg-sky-500" />
            <span>Bank Transfers (Emirates NBD)</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
              {metrics.bankTransferCount ?? 0}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid w-full min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-7">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="min-w-0 p-3 pb-1 sm:p-4 sm:pb-2">
            <CardTitle
              className="truncate text-xs font-medium text-muted-foreground"
              title="Total Inquiries"
            >
              Total Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="truncate text-xl font-bold sm:text-2xl">{metrics.total}</div>
          </CardContent>
        </Card>

        {STATUS_OPTIONS.map((st) => (
          <Card key={st.id} className="min-w-0 overflow-hidden">
            <CardHeader className="min-w-0 p-3 pb-1 sm:p-4 sm:pb-2">
              <CardTitle
                className={cn("truncate text-xs font-medium", st.cardClass)}
                title={st.label}
              >
                {st.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="min-w-0 p-3 pt-0 sm:p-4 sm:pt-0">
              <div className={cn("truncate text-xl font-bold sm:text-2xl", st.cardClass)}>
                {metrics[st.id]}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Status Filter Chips */}
      <div className="flex w-full min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-1">Pipeline:</span>
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          className="h-8 shrink-0 text-xs font-medium"
          onClick={() => updateQuery({ status: "all", page: "1" })}
        >
          All ({metrics.total})
        </Button>
        {STATUS_OPTIONS.map((st) => (
          <Button
            key={st.id}
            variant={statusFilter === st.id ? "default" : "outline"}
            size="sm"
            className="h-8 shrink-0 text-xs font-medium"
            onClick={() => updateQuery({ status: st.id, page: "1" })}
          >
            {st.label} ({metrics[st.id]})
          </Button>
        ))}
      </div>

      {/* Reusable Data Table with Server-side Pagination */}
      <AdminDataTable
        data={localLeads}
        columns={columns}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        searchValue={searchValue}
        searchPlaceholder="Search leads by name, phone, area, or payment ref..."
        emptyMessage="No leads found matching your criteria."
      />

      {/* Lead Details Dialog */}
      <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto sm:w-full">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-bold">{selectedLead?.fullName}</DialogTitle>
              {selectedLead?.requestType === "booking" && (
                <Badge className="bg-sky-500/15 text-sky-600 border-sky-500/30 text-xs">
                  BOOKING ORDER
                </Badge>
              )}
            </div>
            <DialogDescription>
              Lead ID: {selectedLead?.id} &bull; Received on{" "}
              {selectedLead && new Date(selectedLead.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="flex flex-col gap-4 py-2 text-xs">
              {/* Payment Section in Modal */}
              <Card className="border-sky-500/20 bg-sky-500/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-xs font-bold">
                    <span>Payment & Booking Details</span>
                    <Badge
                      className={
                        selectedLead.paymentMethod === "cash"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                          : selectedLead.paymentMethod === "bank_transfer"
                            ? "bg-sky-500/15 text-sky-600 border-sky-500/30"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {selectedLead.paymentMethod === "cash"
                        ? "Cash on Delivery"
                        : selectedLead.paymentMethod === "bank_transfer"
                          ? "Bank Transfer (Emirates NBD)"
                          : "Free Quote"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-muted-foreground">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-semibold text-foreground">Total Amount:</span>{" "}
                      <span className="text-sm font-bold text-foreground">
                        {selectedLead.amount
                          ? `${selectedLead.amount} ${selectedLead.currency || "AED"}`
                          : "Not Applicable"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Payment Status:</span>{" "}
                      <span className="font-semibold text-foreground capitalize">
                        {selectedLead.paymentStatus?.replace(/_/g, " ") || "Pending"}
                      </span>
                    </div>
                  </div>

                  {selectedLead.paymentMethod === "bank_transfer" && (
                    <div className="mt-2 rounded-lg border bg-background p-3 flex flex-col gap-1.5">
                      <span className="font-bold text-foreground">Admin Bank Account Credited:</span>
                      <div className="text-[11px] grid grid-cols-2 gap-2 text-muted-foreground">
                        <div>
                          <span className="font-semibold text-foreground">Bank:</span> Emirates NBD
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Swift:</span> EBILAEAD
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold text-foreground">IBAN:</span>{" "}
                          AE56 0260 0001 2595 4738 201
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold text-foreground">Account:</span>{" "}
                          0125954738201
                        </div>
                        {selectedLead.transactionRef && (
                          <div className="col-span-2 mt-1 rounded bg-muted/60 p-1.5 font-mono text-foreground font-semibold">
                            Customer Ref / Note: {selectedLead.transactionRef}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact & Service Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Client Contact & Service Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">CRM Status:</span>
                    <Badge
                      variant="outline"
                      className={
                        STATUS_OPTIONS.find((s) => s.id === selectedLead.status)?.badgeClass
                      }
                    >
                      {STATUS_OPTIONS.find((s) => s.id === selectedLead.status)?.label ??
                        selectedLead.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Mobile Phone:</span>{" "}
                    <a href={`tel:${selectedLead.mobile}`} className="text-foreground hover:underline">
                      {selectedLead.mobile}
                    </a>
                  </div>
                  {selectedLead.whatsappNumber && (
                    <div>
                      <span className="font-semibold text-foreground">WhatsApp Number:</span>{" "}
                      {selectedLead.whatsappNumber}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-foreground">Requested Service:</span>{" "}
                    {selectedLead.serviceId}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Location / Community:</span>{" "}
                    {selectedLead.location ?? "Not specified"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Preferred Appointment:</span>{" "}
                    {selectedLead.preferredDate ?? "Flexible"} ({selectedLead.preferredTime ?? "Anytime"})
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Source / Campaign:</span>{" "}
                    {selectedLead.sourceArea ?? "main-page"}{" "}
                    {selectedLead.utmSource ? `(${selectedLead.utmSource})` : ""}
                  </div>
                </CardContent>
              </Card>

              {selectedLead.message && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">Customer Message / Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="text-foreground italic">
                    &quot;{selectedLead.message}&quot;
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
