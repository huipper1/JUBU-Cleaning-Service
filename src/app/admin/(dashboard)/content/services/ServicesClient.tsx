"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  Pencil,
} from "lucide-react";
import { toggleServiceActiveAction, updateServiceAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    setServices(
      services.map((item) =>
        item.id === s.id ? { ...item, isActive: nextVal } : item
      )
    );

    const res = await toggleServiceActiveAction(s.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setServices(
        services.map((item) =>
          item.id === s.id ? { ...item, isActive: !nextVal } : item
        )
      );
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
        isActive: s.isActive,
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
                order: editOrder,
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
    <div className="flex flex-col gap-4">
      {services.map((s) => {
        const isEdit = editingId === s.id;

        return (
          <Card key={s.id}>
            <CardContent className="px-2">
              {isEdit ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="font-semibold text-foreground">
                      Editing: {s.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="size-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSave(s)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Save className="size-3.5" />
                        )}
                        <span>Save Changes</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Title
                      </label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Display Order
                      </label>
                      <Input
                        type="number"
                        value={editOrder}
                        onChange={(e) => setEditOrder(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-foreground">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={editShortDesc}
                        onChange={(e) => setEditShortDesc(e.target.value)}
                        className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-foreground">
                        Long Description
                      </label>
                      <textarea
                        rows={3}
                        value={editLongDesc}
                        onChange={(e) => setEditLongDesc(e.target.value)}
                        className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={s.imageSrc}
                        alt={s.imageAlt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {s.title}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          /{s.slug}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Order #{s.order}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {s.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant={s.isActive ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(s)}
                    >
                      {s.isActive ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-emerald-500 mr-1" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3.5 text-muted-foreground mr-1" />
                          <span>Disabled</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(s)}
                    >
                      <Pencil className="size-3.5 mr-1" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
