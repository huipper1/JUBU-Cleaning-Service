"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AlertTriangle, Calendar, MessageSquare, Phone, RotateCcw, Trash2, X } from "lucide-react";
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
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  clearLeadsByDateRangeAction,
  emptyTrashAction,
  moveToTrashAction,
  permanentDeleteLeadAction,
  restoreFromTrashAction,
  updateLeadStatusAction
} from "./actions";

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
  startDateFilter?: string;
  endDateFilter?: string;
  viewFilter?: string;
  trashCount?: number;
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
  startDateFilter = "",
  endDateFilter = "",
  viewFilter = "active",
  trashCount = 0,
  metrics
}: LeadsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localLeads, setLocalLeads] = React.useState<Lead[]>(leads);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);

  // Date inputs state
  const [startDate, setStartDate] = React.useState(startDateFilter);
  const [endDate, setEndDate] = React.useState(endDateFilter);

  // 2-Step Clear / Delete Modals state
  const [leadToDelete, setLeadToDelete] = React.useState<Lead | null>(null);
  const [isDeletingLead, setIsDeletingLead] = React.useState(false);

  // 2-step Clear Data modal: step 0 (closed), step 1 (warning), step 2 (typed confirmation)
  const [clearDataModalStep, setClearDataModalStep] = React.useState<0 | 1 | 2>(0);
  const [confirmDeleteText, setConfirmDeleteText] = React.useState("");
  const [isClearingData, setIsClearingData] = React.useState(false);

  React.useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  React.useEffect(() => {
    setStartDate(startDateFilter);
    setEndDate(endDateFilter);
  }, [startDateFilter, endDateFilter]);

  const updateQuery = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([k, v]) => {
      if (
        v === null ||
        v === "" ||
        ((k === "status" || k === "paymentMethod") && v === "all") ||
        (k === "view" && v === "active")
      ) {
        current.delete(k);
      } else {
        current.set(k, v);
      }
    });
    router.push(`${pathname}?${current.toString()}`);
  };

  const applyDateFilter = (start?: string, end?: string) => {
    const s = start !== undefined ? start : startDate;
    const e = end !== undefined ? end : endDate;
    updateQuery({
      startDate: s || null,
      endDate: e || null,
      page: "1"
    });
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    updateQuery({
      startDate: null,
      endDate: null,
      page: "1"
    });
  };

  const setDatePreset = (preset: "today" | "last7" | "last30" | "thisMonth") => {
    const today = new Date();
    const formatYMD = (d: Date) => d.toISOString().split("T")[0];
    const todayStr = formatYMD(today);

    if (preset === "today") {
      setStartDate(todayStr);
      setEndDate(todayStr);
      applyDateFilter(todayStr, todayStr);
    } else if (preset === "last7") {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      const pastStr = formatYMD(past);
      setStartDate(pastStr);
      setEndDate(todayStr);
      applyDateFilter(pastStr, todayStr);
    } else if (preset === "last30") {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      const pastStr = formatYMD(past);
      setStartDate(pastStr);
      setEndDate(todayStr);
      applyDateFilter(pastStr, todayStr);
    } else if (preset === "thisMonth") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstStr = formatYMD(firstDay);
      setStartDate(firstStr);
      setEndDate(todayStr);
      applyDateFilter(firstStr, todayStr);
    }
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

  const handleMoveToTrash = async (lead: Lead) => {
    const prev = [...localLeads];
    setLocalLeads(localLeads.filter((l) => l.id !== lead.id));
    toast.loading("Moving lead to Trash...", { id: `trash-${lead.id}` });

    const res = await moveToTrashAction(lead.id);
    if (!res.success) {
      toast.error(res.error || "Failed to move lead to Trash", { id: `trash-${lead.id}` });
      setLocalLeads(prev);
    } else {
      toast.success(`"${lead.fullName}" moved to Trash`, { id: `trash-${lead.id}` });
      router.refresh();
    }
  };

  const handleRestoreFromTrash = async (lead: Lead) => {
    const prev = [...localLeads];
    setLocalLeads(localLeads.filter((l) => l.id !== lead.id));
    toast.loading("Restoring lead from Trash...", { id: `restore-${lead.id}` });

    const res = await restoreFromTrashAction(lead.id);
    if (!res.success) {
      toast.error(res.error || "Failed to restore lead", { id: `restore-${lead.id}` });
      setLocalLeads(prev);
    } else {
      toast.success(`"${lead.fullName}" restored to active leads`, { id: `restore-${lead.id}` });
      router.refresh();
    }
  };

  const handlePermanentDeleteSingle = async () => {
    if (!leadToDelete) return;
    setIsDeletingLead(true);
    const target = leadToDelete;

    const res = await permanentDeleteLeadAction(target.id);
    setIsDeletingLead(false);
    setLeadToDelete(null);

    if (!res.success) {
      toast.error(res.error || "Failed to permanently delete lead");
    } else {
      toast.success(`"${target.fullName}" was permanently removed from database and website`);
      router.refresh();
    }
  };

  const handleExecuteClearData = async () => {
    if (confirmDeleteText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsClearingData(true);
    if (viewFilter === "trash") {
      // Empty entire Trash
      const res = await emptyTrashAction();
      setIsClearingData(false);
      setClearDataModalStep(0);
      setConfirmDeleteText("");
      if (!res.success) {
        toast.error(res.error || "Failed to empty Trash");
      } else {
        toast.success(`Trash cleared! ${res.count ?? 0} leads permanently deleted`);
        router.refresh();
      }
    } else {
      // Clear leads by active Date Range filter or all
      const res = await clearLeadsByDateRangeAction(startDate || undefined, endDate || undefined);
      setIsClearingData(false);
      setClearDataModalStep(0);
      setConfirmDeleteText("");
      if (!res.success) {
        toast.error(res.error || "Failed to clear leads");
      } else {
        toast.success(`Cleared ${res.count ?? 0} leads permanently from the database`);
        router.refresh();
      }
    }
  };

  const isTrashView = viewFilter === "trash";

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
                <Badge className="border-sky-500/30 bg-sky-500/15 text-[10px] font-bold text-sky-600">
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
                  <span className="max-w-[140px] truncate" title={lead.transactionRef}>
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
      cell: (lead) =>
        isTrashView ? (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-xs text-rose-500"
          >
            In Trash
          </Badge>
        ) : (
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
        <div className="flex items-center justify-end gap-1.5">
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

          {isTrashView ? (
            <>
              <Button
                variant="outline"
                size="sm"
                title="Restore Lead"
                className="h-8 gap-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
                onClick={() => handleRestoreFromTrash(lead)}
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Restore</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                title="Delete Permanently"
                className="h-8 gap-1 text-xs font-semibold"
                onClick={() => setLeadToDelete(lead)}
              >
                <Trash2 className="size-3.5" />
                <span className="hidden sm:inline">Delete Permanently</span>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              title="Move to Trash"
              className="h-8 text-xs font-semibold text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600"
              onClick={() => handleMoveToTrash(lead)}
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only sm:not-sr-only sm:inline">Trash</span>
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6">
      {/* Top Controls: View Tabs (Active vs Trash) + Date Range Filter + Clear Data */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-xs">
        {/* Active vs Trash View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant={!isTrashView ? "default" : "outline"}
              size="sm"
              onClick={() => updateQuery({ view: "active", page: "1" })}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <span>Active Leads</span>
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px]">
                {metrics.total}
              </Badge>
            </Button>

            <Button
              variant={isTrashView ? "destructive" : "outline"}
              size="sm"
              onClick={() => updateQuery({ view: "trash", page: "1" })}
              className={cn(
                "h-8 gap-1.5 text-xs font-semibold",
                !isTrashView && trashCount > 0 && "text-rose-600 hover:text-rose-700"
              )}
            >
              <Trash2 className="size-3.5" />
              <span>Trash</span>
              <Badge
                variant={isTrashView ? "outline" : "secondary"}
                className={cn(
                  "ml-1 px-1.5 py-0 text-[10px]",
                  trashCount > 0 && "bg-rose-500/15 font-bold text-rose-600"
                )}
              >
                {trashCount}
              </Badge>
            </Button>
          </div>

          {/* 2-Step Clear Data / Empty Trash Action Button */}
          <div className="flex items-center gap-2">
            {isTrashView ? (
              <Button
                variant="destructive"
                size="sm"
                disabled={trashCount === 0}
                onClick={() => {
                  setClearDataModalStep(1);
                  setConfirmDeleteText("");
                }}
                className="h-8 gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="size-3.5" />
                <span>Empty Trash</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setClearDataModalStep(1);
                  setConfirmDeleteText("");
                }}
                className="h-8 gap-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
              >
                <AlertTriangle className="size-3.5" />
                <span>
                  {startDateFilter || endDateFilter ? "Clear Filtered Data" : "Clear All Data"}
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Date Range Filter Bar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Calendar className="size-3.5" />
              Date Range:
            </span>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDatePreset("today")}
                className="h-7 px-2 text-[11px]"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDatePreset("last7")}
                className="h-7 px-2 text-[11px]"
              >
                Last 7 Days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDatePreset("last30")}
                className="h-7 px-2 text-[11px]"
              >
                Last 30 Days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDatePreset("thisMonth")}
                className="h-7 px-2 text-[11px]"
              >
                This Month
              </Button>
            </div>
          </div>

          {/* Date Pickers & Apply Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 w-36 text-xs"
                placeholder="From"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 w-36 text-xs"
                placeholder="To"
              />
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => applyDateFilter()}
              disabled={!startDate && !endDate}
              className="h-8 text-xs font-semibold"
            >
              Apply Filter
            </Button>

            {(startDateFilter || endDateFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateFilter}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                title="Reset Date Range"
              >
                <X className="mr-1 size-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Primary Channel & Payment Section Tabs */}
        {!isTrashView && (
          <div className="flex flex-col gap-2 border-t pt-2">
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
                <span>All Channels</span>
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
        )}
      </div>

      {/* Metric Cards (Displayed for active leads) */}
      {!isTrashView && (
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
      )}

      {/* Pipeline Status Filter Chips */}
      {!isTrashView && (
        <div className="flex w-full min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="mr-1 text-xs font-medium text-muted-foreground">Pipeline:</span>
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
      )}

      {isTrashView && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            You are currently viewing <strong>Trash ({totalCount} items)</strong>. Items in trash
            are hidden from your live pipeline and dashboard. You can restore them anytime or delete
            them permanently from the database.
          </span>
        </div>
      )}

      {/* Reusable Data Table with Server-side Pagination */}
      <AdminDataTable
        data={localLeads}
        columns={columns}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        searchValue={searchValue}
        searchPlaceholder={
          isTrashView
            ? "Search trashed leads..."
            : "Search leads by name, phone, area, or payment ref..."
        }
        emptyMessage={
          isTrashView
            ? "Trash is empty. No deleted leads found."
            : "No leads found matching your criteria."
        }
      />

      {/* Lead Details Dialog */}
      <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-xl overflow-y-auto sm:w-full">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-bold">{selectedLead?.fullName}</DialogTitle>
              {selectedLead?.requestType === "booking" && (
                <Badge className="border-sky-500/30 bg-sky-500/15 text-xs text-sky-600">
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
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-600"
                          : selectedLead.paymentMethod === "bank_transfer"
                            ? "border-sky-500/30 bg-sky-500/15 text-sky-600"
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
                      <span className="font-medium text-foreground capitalize">
                        {selectedLead.paymentStatus?.replace(/_/g, " ") || "Pending Confirmation"}
                      </span>
                    </div>
                  </div>

                  {selectedLead.paymentMethod === "bank_transfer" && (
                    <div className="mt-2 rounded-lg border border-sky-500/20 bg-background/50 p-2.5">
                      <div className="mb-1.5 font-bold text-foreground">Official Bank Account:</div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <div>
                          <span className="font-semibold text-foreground">Bank:</span> Emirates NBD
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">Title:</span> JUBU
                          CLEANING SERVICES L.L.C
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold text-foreground">IBAN:</span> AE56 0260
                          0001 2595 4738 201
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold text-foreground">Account:</span>{" "}
                          0125954738201
                        </div>
                        {selectedLead.transactionRef && (
                          <div className="col-span-2 mt-1 rounded bg-muted/60 p-1.5 font-mono font-semibold text-foreground">
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
                    <a
                      href={`tel:${selectedLead.mobile}`}
                      className="text-foreground hover:underline"
                    >
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
                    {selectedLead.preferredDate ?? "Flexible"} (
                    {selectedLead.preferredTime ?? "Anytime"})
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

      {/* Confirmation Dialog: Permanent Delete Single Lead */}
      <Dialog open={Boolean(leadToDelete)} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="size-5" />
              <span>Delete Permanently</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete lead &ldquo;{leadToDelete?.fullName}
              &rdquo;?
              <br />
              <strong className="text-rose-600 dark:text-rose-400">
                This action cannot be undone. This record will be permanently deleted from the
                database and website.
              </strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isDeletingLead}
              onClick={() => setLeadToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeletingLead}
              onClick={handlePermanentDeleteSingle}
            >
              {isDeletingLead ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2-Step Confirmation Modal: Clear Data / Empty Trash */}
      <Dialog
        open={clearDataModalStep > 0}
        onOpenChange={(open) => {
          if (!open) {
            setClearDataModalStep(0);
            setConfirmDeleteText("");
          }
        }}
      >
        <DialogContent className="max-w-lg">
          {clearDataModalStep === 1 && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-rose-600">
                  <AlertTriangle className="size-5" />
                  <span>
                    Step 1 of 2: {isTrashView ? "Empty Trash" : "Clear Lead Data"} Warning
                  </span>
                </DialogTitle>
                <DialogDescription className="space-y-2 pt-2 text-sm">
                  {isTrashView ? (
                    <p>
                      You are about to permanently purge{" "}
                      <strong>all items currently in the Trash</strong>. Once purged, these leads
                      cannot be recovered by anyone.
                    </p>
                  ) : (
                    <p>
                      {startDateFilter || endDateFilter ? (
                        <>
                          You are about to permanently delete all leads between{" "}
                          <strong>{startDateFilter || "start"}</strong> and{" "}
                          <strong>{endDateFilter || "now"}</strong>.
                        </>
                      ) : (
                        <>
                          You are about to permanently delete <strong>ALL leads</strong> from the
                          database.
                        </>
                      )}
                    </p>
                  )}
                  <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300">
                    <strong>Critical Warning:</strong> This will execute a permanent hard-delete
                    from PostgreSQL database. All customer data, booking history, and references
                    will be irrecoverably wiped.
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setClearDataModalStep(0)}>
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setClearDataModalStep(2)}>
                  Proceed to Step 2 &rarr;
                </Button>
              </DialogFooter>
            </>
          )}

          {clearDataModalStep === 2 && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-rose-600">
                  <AlertTriangle className="size-5" />
                  <span>Step 2 of 2: Confirm Destruction</span>
                </DialogTitle>
                <DialogDescription className="space-y-3 pt-2 text-sm">
                  <p>
                    To prevent accidental deletion, please type{" "}
                    <span className="rounded border bg-muted px-1.5 py-0.5 font-mono font-bold text-foreground">
                      DELETE
                    </span>{" "}
                    below to confirm:
                  </p>
                  <Input
                    placeholder='Type "DELETE"'
                    value={confirmDeleteText}
                    onChange={(e) => setConfirmDeleteText(e.target.value)}
                    className="font-mono text-sm"
                    autoFocus
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isClearingData}
                  onClick={() => {
                    setClearDataModalStep(1);
                    setConfirmDeleteText("");
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={confirmDeleteText !== "DELETE" || isClearingData}
                  onClick={handleExecuteClearData}
                >
                  {isClearingData ? "Purging Records..." : "Permanently Delete Now"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
