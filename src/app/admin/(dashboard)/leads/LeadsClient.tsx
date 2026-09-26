"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types/lead";
import { updateLeadStatusAction, updateLeadNotesAction } from "./actions";
import { AdminDataTable, ColumnDef } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface LeadsClientProps {
  leads: Lead[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchValue: string;
  statusFilter: string;
  metrics: {
    total: number;
    pending: number;
    contacted: number;
    closed: number;
  };
}

export function LeadsClient({
  leads,
  totalCount,
  currentPage,
  pageSize,
  searchValue,
  statusFilter,
  metrics,
}: LeadsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localLeads, setLocalLeads] = React.useState<Lead[]>(leads);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = React.useState("");
  const [isSavingNotes, setIsSavingNotes] = React.useState(false);

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
    setLocalLeads(
      localLeads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    const res = await updateLeadStatusAction(leadId, newStatus);
    if (!res.success) {
      toast.error("Failed to update status");
      setLocalLeads(prev);
    } else {
      toast.success(`Lead marked as ${newStatus}`);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    const res = await updateLeadNotesAction(selectedLead.id, notesDraft);
    if (res.success) {
      toast.success("Internal notes saved");
    } else {
      toast.error("Failed to save notes");
    }
    setIsSavingNotes(false);
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
                className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <MessageSquare className="size-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        );
      },
    },
    {
      header: "Service & Property",
      cell: (lead) => (
        <div className="flex flex-col gap-0.5">
          <Badge variant="outline" className="w-fit">
            {lead.serviceId}
          </Badge>
          {lead.propertyType && (
            <span className="text-xs text-muted-foreground">
              Property: {lead.propertyType}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Source / Area",
      cell: (lead) => (
        <div className="flex flex-col gap-0.5">
          <Badge variant="secondary" className="w-fit font-mono text-[11px]">
            {lead.sourceArea ?? "main-page"}
          </Badge>
          {lead.utmSource && (
            <span className="text-[10px] text-muted-foreground">
              via {lead.utmSource}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (lead) => (
        <select
          value={lead.status}
          onChange={(e) =>
            handleStatusChange(lead.id, e.target.value as LeadStatus)
          }
          className="rounded-md border bg-background px-2 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      ),
    },
    {
      header: "Date",
      cell: (lead) => (
        <span className="text-xs text-muted-foreground">
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      cell: (lead) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedLead(lead);
            setNotesDraft("");
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Pending Follow-up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {metrics.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Contacted / Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.contacted}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Closed / Won
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.closed}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {["all", "pending", "contacted", "closed"].map((st) => (
          <Button
            key={st}
            variant={statusFilter === st ? "default" : "outline"}
            size="sm"
            onClick={() => updateQuery({ status: st, page: "1" })}
            className="capitalize"
          >
            {st}
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
      <Dialog
        open={Boolean(selectedLead)}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      >
        <DialogContent className="max-w-lg">
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Contact & Service</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Phone:</span>{" "}
                    {selectedLead.mobile}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Service:</span>{" "}
                    {selectedLead.serviceId}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Location / Community:
                    </span>{" "}
                    {selectedLead.location ?? "Not specified"}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Preferred Date:
                    </span>{" "}
                    {selectedLead.preferredDate ?? "Flexible"}
                  </div>
                </CardContent>
              </Card>

              {selectedLead.message && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">Inquiry Message</CardTitle>
                  </CardHeader>
                  <CardContent className="italic text-foreground">
                    "{selectedLead.message}"
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs">Internal Notes</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <textarea
                    rows={3}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Quotation given, assigned team, etc..."
                    className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
