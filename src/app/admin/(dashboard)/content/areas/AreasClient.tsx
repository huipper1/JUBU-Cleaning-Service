"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, CheckCircle2, XCircle, Edit2, Save, X, Loader2 } from "lucide-react";
import { toggleAreaActiveAction, updateAreaAction } from "./actions";

interface AreaItem {
  id: string;
  name: string;
  slug: string;
  lat?: number;
  lng?: number;
  order: number;
  isActive: boolean;
}

interface AreasClientProps {
  initialAreas: AreaItem[];
}

export function AreasClient({ initialAreas }: AreasClientProps) {
  const [areas, setAreas] = useState<AreaItem[]>(initialAreas);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLat, setEditLat] = useState<number | undefined>(undefined);
  const [editLng, setEditLng] = useState<number | undefined>(undefined);
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (area: AreaItem) => {
    const nextVal = !area.isActive;
    setAreas(areas.map((a) => (a.id === area.id ? { ...a, isActive: nextVal } : a)));

    const res = await toggleAreaActiveAction(area.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setAreas(areas.map((a) => (a.id === area.id ? { ...a, isActive: !nextVal } : a)));
    } else {
      toast.success(`${area.name} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  const startEdit = (area: AreaItem) => {
    setEditingId(area.id);
    setEditName(area.name);
    setEditLat(area.lat);
    setEditLng(area.lng);
    setEditOrder(area.order);
  };

  const handleSave = async (area: AreaItem) => {
    setIsSaving(true);
    try {
      const res = await updateAreaAction(area.id, {
        name: editName,
        lat: editLat,
        lng: editLng,
        order: editOrder,
        isActive: area.isActive
      });

      if (res.success) {
        setAreas(
          areas.map((a) =>
            a.id === area.id
              ? {
                  ...a,
                  name: editName,
                  lat: editLat,
                  lng: editLng,
                  order: editOrder
                }
              : a
          )
        );
        toast.success("Service Area updated!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save area");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dubai Service Areas</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage the 10 supported coverage areas and their interactive map coordinates.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {areas.map((area) => {
          const isEdit = editingId === area.id;

          return (
            <div
              key={area.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl"
            >
              {isEdit ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">Editing {area.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSave(area)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300">Area Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={editLat ?? ""}
                        onChange={(e) => setEditLat(e.target.value ? Number(e.target.value) : undefined)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={editLng ?? ""}
                        onChange={(e) => setEditLng(e.target.value ? Number(e.target.value) : undefined)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-emerald-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{area.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">/{area.slug}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Coords: {area.lat ?? "N/A"}, {area.lng ?? "N/A"} &bull; Order #{area.order}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(area)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        area.isActive
                          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                      }`}
                    >
                      {area.isActive ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => startEdit(area)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-800/60 px-3 py-1 text-xs text-slate-300 hover:text-white"
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
