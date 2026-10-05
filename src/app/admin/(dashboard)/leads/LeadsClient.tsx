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
  metrics: {
    total: number;
    new: number;
    contacted: number;
    quotation_sent: number;
    confirmed: number;
    completed: number;
    lost_cancelled: number;
  };
}

export function LeadsClient({
  leads,
  totalCount,
  currentPage,
  pageSize,
  searchValue,
  statusFilter,
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
      if (v === null || v === "" || (k === "status" && v === "all")) {
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
            <span className="font-semibold text-foreground">{lead.fullName}</span>
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
      header: "Status",
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
          variant="ghost"
          size="sm"
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

      {/* Filter Chips */}
      <div className="flex w-full min-w-0 flex-wrap items-center gap-1.5 sm:gap-2">
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
        searchPlaceholder="Search leads by name, phone, area..."
        emptyMessage="No leads found matching your criteria."
      />

      {/* Lead Details Dialog */}
      <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto sm:w-full">
          <DialogHeader>
            <DialogTitle>{selectedLead?.fullName}</DialogTitle>
            <DialogDescription>
              Lead ID: {selectedLead?.id} &bull; Received on{" "}
              {selectedLead && new Date(selectedLead.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="flex flex-col gap-4 py-2 text-xs">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs">Contact & Service</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">Status:</span>
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
                    <span className="font-semibold text-foreground">Phone:</span>{" "}
                    {selectedLead.mobile}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Service:</span>{" "}
                    {selectedLead.serviceId}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Location / Community:</span>{" "}
                    {selectedLead.location ?? "Not specified"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Preferred Date:</span>{" "}
                    {selectedLead.preferredDate ?? "Flexible"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Preferred Time:</span>{" "}
                    {selectedLead.preferredTime ?? "Flexible"}
                  </div>
                </CardContent>
              </Card>

              {selectedLead.message && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs">Inquiry Message</CardTitle>
                  </CardHeader>
                  <CardContent className="text-foreground italic">
                    &quot;{selectedLead.message}&quot;
                  </CardContent>
                </Card>
              )}

              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-xs">Internal Notes</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <textarea
                    rows={3}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Quotation given, assigned team, etc..."
                    className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="w-fit"
                  >
                    {isSavingNotes ? "Saving..." : "Save Note"}
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
