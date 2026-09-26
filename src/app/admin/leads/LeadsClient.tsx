"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Inbox,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  X,
  Loader2,
  Calendar,
  Home,
  Tag
} from "lucide-react";
import type { Lead, LeadStatus } from "@/types/lead";
import { updateLeadStatusAction, updateLeadNotesAction } from "./actions";

interface LeadsClientProps {
  initialLeads: Lead[];
}

export function LeadsClient({ initialLeads }: LeadsClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.mobile.includes(searchQuery) ||
      (lead.location && lead.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.sourceArea && lead.sourceArea.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Inline Status Change
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const prev = [...leads];
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    const res = await updateLeadStatusAction(leadId, newStatus);
    if (!res.success) {
      toast.error("Failed to update status");
      setLeads(prev);
    } else {
      toast.success(`Lead marked as ${newStatus}`);
    }
  };

  const openDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setNotesDraft("");
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

  return (
    <div className="space-y-6">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-xs font-medium text-slate-400">Total Leads</div>
          <div className="mt-2 text-2xl font-bold text-white">{leads.length}</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-xs font-medium text-amber-400">Pending Follow-up</div>
          <div className="mt-2 text-2xl font-bold text-amber-400">
            {leads.filter((l) => l.status === "pending").length}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-xs font-medium text-blue-400">Contacted / In Progress</div>
          <div className="mt-2 text-2xl font-bold text-blue-400">
            {leads.filter((l) => l.status === "contacted").length}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="text-xs font-medium text-emerald-400">Closed / Completed</div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">
            {leads.filter((l) => l.status === "closed").length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "pending", "contacted", "closed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone, area..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Client & Contact</th>
                <th className="px-6 py-3.5">Service & Property</th>
                <th className="px-6 py-3.5">Source & Campaign</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No leads matching your current criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = lead.mobile.replace(/\D/g, "");
                  const whatsappTarget = cleanPhone.startsWith("0")
                    ? `971${cleanPhone.slice(1)}`
                    : cleanPhone;

                  return (
                    <tr key={lead.id} className="transition-colors hover:bg-slate-800/30">
                      {/* Name & Phone */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{lead.fullName}</div>
                        <div className="mt-1 flex items-center gap-3">
                          <a
                            href={`tel:${lead.mobile}`}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{lead.mobile}</span>
                          </a>

                          <a
                            href={`https://wa.me/${whatsappTarget}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </td>

                      {/* Service & Property */}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 font-medium text-slate-200">
                          {lead.serviceId}
                        </span>
                        {lead.propertyType && (
                          <div className="mt-1 text-[11px] text-slate-400">
                            Property: {lead.propertyType}
                          </div>
                        )}
                      </td>

                      {/* Source & UTM */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-emerald-400">
                          {lead.sourceArea ?? "main-page"}
                        </span>
                        {lead.utmSource && (
                          <div className="mt-0.5 text-[10px] text-slate-500">
                            via {lead.utmSource} / {lead.utmCampaign ?? "direct"}
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value as LeadStatus)
                          }
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border-0 focus:ring-1 focus:ring-emerald-500 ${
                            lead.status === "pending"
                              ? "bg-amber-500/10 text-amber-400"
                              : lead.status === "contacted"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          <option value="pending" className="bg-slate-900 text-amber-400">
                            Pending
                          </option>
                          <option value="contacted" className="bg-slate-900 text-blue-400">
                            Contacted
                          </option>
                          <option value="closed" className="bg-slate-900 text-emerald-400">
                            Closed
                          </option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>

                      {/* Detail Drawer Trigger */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDrawer(lead)}
                          className="rounded-lg border border-slate-800 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:border-slate-700 hover:text-white"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-lg border-l border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedLead.fullName}</h3>
                <span className="text-xs text-slate-400">Lead ID: {selectedLead.id}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-xs">
              {/* Contact Information */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="font-semibold text-white">Contact & Location</div>
                <div>Phone: {selectedLead.mobile}</div>
                <div>WhatsApp Number: {selectedLead.whatsappNumber ?? selectedLead.mobile}</div>
                <div>Location / Community: {selectedLead.location ?? "Not specified"}</div>
                <div>Preferred Service Date: {selectedLead.preferredDate ?? "Flexible"}</div>
              </div>

              {/* Client Message */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="font-semibold text-white">Client Inquiry Message</div>
                <p className="text-slate-300 italic leading-relaxed">
                  "{selectedLead.message || "No specific instructions provided."}"
                </p>
              </div>

              {/* Attribution / Campaign Tracking */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="font-semibold text-white">Ad & Campaign Attribution</div>
                <div>Source Area: {selectedLead.sourceArea ?? "main-page"}</div>
                <div>UTM Source: {selectedLead.utmSource ?? "direct"}</div>
                <div>UTM Medium: {selectedLead.utmMedium ?? "none"}</div>
                <div>UTM Campaign: {selectedLead.utmCampaign ?? "none"}</div>
                <div>FBCLID: {selectedLead.fbclid ?? "none"}</div>
                <div className="truncate">Landing URL: {selectedLead.landingUrl ?? "n/a"}</div>
              </div>

              {/* Internal Admin CRM Notes */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="font-semibold text-white">Internal Notes & Quotation Log</div>
                <textarea
                  rows={4}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record quote amount, assigned cleaner team, client preferences..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isSavingNotes ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>Save Note</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
