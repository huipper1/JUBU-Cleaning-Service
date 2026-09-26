"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageIcon, CheckCircle2, XCircle, Edit2, Save, X, Loader2 } from "lucide-react";
import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { toggleGalleryItemActiveAction, updateGalleryItemAction } from "./actions";

interface GalleryItemType {
  id: string;
  title: string;
  caption?: string;
  serviceId: string;
  serviceName?: string;
  imageSrc: string;
  imageAlt: string;
  isBeforeAfter: boolean;
  order: number;
  isActive: boolean;
}

interface GalleryClientProps {
  initialItems: GalleryItemType[];
}

export function GalleryClient({ initialItems }: GalleryClientProps) {
  const [items, setItems] = useState<GalleryItemType[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editImageSrc, setEditImageSrc] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (item: GalleryItemType) => {
    const nextVal = !item.isActive;
    setItems(items.map((i) => (i.id === item.id ? { ...i, isActive: nextVal } : i)));

    const res = await toggleGalleryItemActiveAction(item.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setItems(items.map((i) => (i.id === item.id ? { ...i, isActive: !nextVal } : i)));
    } else {
      toast.success(`${item.title} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  const startEdit = (item: GalleryItemType) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCaption(item.caption ?? "");
    setEditImageSrc(item.imageSrc);
    setEditOrder(item.order);
  };

  const handleSave = async (item: GalleryItemType) => {
    setIsSaving(true);
    try {
      const res = await updateGalleryItemAction(item.id, {
        title: editTitle,
        caption: editCaption || undefined,
        imageSrc: editImageSrc,
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
                  caption: editCaption || undefined,
                  imageSrc: editImageSrc,
                  order: editOrder
                }
              : i
          )
        );
        toast.success("Gallery item updated!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save item");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects Gallery</h1>
          <p className="mt-1 text-sm text-slate-400">
            Showcase real cleaning jobs and before/after comparisons with 4:3 standard cropper.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => {
          const isEdit = editingId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl flex flex-col justify-between"
            >
              {isEdit ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Editing {item.title}</span>
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
                    <ImageCropUploader
                      currentImageUrl={editImageSrc}
                      folder="gallery"
                      aspectRatio={4 / 3} // 4:3 enforced per CMS plan
                      label="Project Photo (4:3 Ratio)"
                      onUploadComplete={(url) => setEditImageSrc(url)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                      <label className="block text-[11px] font-medium text-slate-300">Order</label>
                      <input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300">Caption</label>
                    <textarea
                      rows={2}
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover"
                    />

                    {item.isBeforeAfter && (
                      <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-md border border-slate-800">
                        Before / After
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      {item.serviceName && (
                        <span className="text-xs text-emerald-400 font-medium">
                          {item.serviceName}
                        </span>
                      )}
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

                  {item.caption && (
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Display Order #{item.order}</span>
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
