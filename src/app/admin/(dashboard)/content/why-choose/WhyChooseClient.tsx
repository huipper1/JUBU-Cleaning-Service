"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, XCircle, Edit2, Save, X, Loader2 } from "lucide-react";
import { toggleWhyChooseActiveAction, updateWhyChooseAction } from "./actions";

interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface WhyChooseClientProps {
  initialItems: WhyChooseItem[];
}

export function WhyChooseClient({ initialItems }: WhyChooseClientProps) {
  const [items, setItems] = useState<WhyChooseItem[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (item: WhyChooseItem) => {
    const nextVal = !item.isActive;
    setItems(items.map((i) => (i.id === item.id ? { ...i, isActive: nextVal } : i)));

    const res = await toggleWhyChooseActiveAction(item.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setItems(items.map((i) => (i.id === item.id ? { ...i, isActive: !nextVal } : i)));
    } else {
      toast.success(`${item.title} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  const startEdit = (item: WhyChooseItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description);
    setEditOrder(item.order);
  };

  const handleSave = async (item: WhyChooseItem) => {
    setIsSaving(true);
    try {
      const res = await updateWhyChooseAction(item.id, {
        title: editTitle,
        description: editDesc,
        order: editOrder,
        isActive: item.isActive
      });

      if (res.success) {
        setItems(
          items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  title: editTitle,
                  description: editDesc,
                  order: editOrder
                }
              : i
          )
        );
        toast.success("Item updated and published live!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save item");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Why Choose Us Highlights</h1>
          <p className="mt-1 text-sm text-slate-400">
            Edit the 4 core trust pillars displayed across the website.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const isEdit = editingId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl flex flex-col justify-between"
            >
              {isEdit ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Editing #{item.order}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg p-1 text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSave(item)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300">Description</label>
                    <textarea
                      rows={3}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <span className="text-[10px] text-slate-500 font-mono">Order #{item.order}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(item)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.isActive
                          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                      }`}
                    >
                      {item.isActive ? "Active" : "Disabled"}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">{item.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-1 text-xs text-slate-300 hover:text-white"
                    >
                      <Edit2 className="h-3 w-3" />
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
