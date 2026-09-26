"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  X,
  Loader2
} from "lucide-react";
import { toggleServiceActiveAction, updateServiceAction } from "./actions";

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  icon: string;
  imageSrc: string;
  imageAlt: string;
  order: number;
  isActive: boolean;
}

interface ServicesClientProps {
  initialServices: ServiceItem[];
}

export function ServicesClient({ initialServices }: ServicesClientProps) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editShortDesc, setEditShortDesc] = useState("");
  const [editLongDesc, setEditLongDesc] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (s: ServiceItem) => {
    const nextVal = !s.isActive;
    setServices(services.map((item) => (item.id === s.id ? { ...item, isActive: nextVal } : item)));

    const res = await toggleServiceActiveAction(s.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setServices(services.map((item) => (item.id === s.id ? { ...item, isActive: !nextVal } : item)));
    } else {
      toast.success(`${s.title} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  const startEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setEditTitle(s.title);
    setEditShortDesc(s.shortDescription);
    setEditLongDesc(s.longDescription ?? "");
    setEditOrder(s.order);
  };

  const handleSave = async (s: ServiceItem) => {
    setIsSaving(true);
    try {
      const res = await updateServiceAction(s.id, {
        title: editTitle,
        shortDescription: editShortDesc,
        longDescription: editLongDesc || undefined,
        order: editOrder,
        isActive: s.isActive
      });

      if (res.success) {
        setServices(
          services.map((item) =>
            item.id === s.id
              ? {
                  ...item,
                  title: editTitle,
                  shortDescription: editShortDesc,
                  longDescription: editLongDesc || undefined,
                  order: editOrder
                }
              : item
          )
        );
        toast.success("Service updated and published live!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save service");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Services Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Edit cleaning service titles, descriptions, display order, and live status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {services.map((s) => {
          const isEdit = editingId === s.id;

          return (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl"
            >
              {isEdit ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Editing {s.title}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSave(s)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300">Display Order</label>
                      <input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={editShortDesc}
                        onChange={(e) => setEditShortDesc(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300">
                        Long Description
                      </label>
                      <textarea
                        rows={3}
                        value={editLongDesc}
                        onChange={(e) => setEditLongDesc(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                      <Image
                        src={s.imageSrc}
                        alt={s.imageAlt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{s.title}</span>
                        <span className="font-mono text-[10px] text-slate-500">/{s.slug}</span>
                        <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                          #{s.order}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-300 line-clamp-2">{s.shortDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={() => handleToggle(s)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        s.isActive
                          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                      }`}
                    >
                      {s.isActive ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => startEdit(s)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800/60 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
