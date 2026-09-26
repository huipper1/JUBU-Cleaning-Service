"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { updateSettingsAction, type UpdateSettingsData } from "./actions";

interface SettingsClientProps {
  initialSettings: UpdateSettingsData;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [formData, setFormData] = useState<UpdateSettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UpdateSettingsData, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSettingsAction(formData);
      if (res.success) {
        toast.success("Site settings updated and published live!");
      } else {
        toast.error(res.error ?? "Failed to save settings");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">General Site Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your company details, Dubai trade licence, contact info, and default SEO.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Contact & Physical Address */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
          Contact & Address
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange("tagline", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Phone Display</label>
            <input
              type="text"
              value={formData.phoneDisplay}
              onChange={(e) => handleChange("phoneDisplay", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">WhatsApp Display</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Official Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Working Hours</label>
            <input
              type="text"
              value={formData.workingHours}
              onChange={(e) => handleChange("workingHours", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300">Registered Office Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Trade Licence Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400">
          Dubai Trade Licence Verification
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-300">Licence Number</label>
            <input
              type="text"
              value={formData.licenceNumber}
              onChange={(e) => handleChange("licenceNumber", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Legal Structure</label>
            <input
              type="text"
              value={formData.licenceStructure}
              onChange={(e) => handleChange("licenceStructure", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Issuing Authority</label>
            <input
              type="text"
              value={formData.licenceAuthority}
              onChange={(e) => handleChange("licenceAuthority", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Issue Date</label>
            <input
              type="text"
              value={formData.licenceIssueDate}
              onChange={(e) => handleChange("licenceIssueDate", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* SEO Metadata */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400">
          SEO & Social Metadata
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300">Default Meta Title</label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleChange("seoTitle", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Default Meta Description</label>
            <textarea
              rows={3}
              value={formData.seoDescription}
              onChange={(e) => handleChange("seoDescription", e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
