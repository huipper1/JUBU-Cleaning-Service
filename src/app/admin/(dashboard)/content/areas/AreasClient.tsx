"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, CheckCircle2, XCircle, Pencil, Save, X, Loader2 } from "lucide-react";
import { toggleAreaActiveAction, updateAreaAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    setAreas(
      areas.map((a) => (a.id === area.id ? { ...a, isActive: nextVal } : a))
    );

    const res = await toggleAreaActiveAction(area.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setAreas(
        areas.map((a) => (a.id === area.id ? { ...a, isActive: !nextVal } : a))
      );
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
        isActive: area.isActive,
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
                  order: editOrder,
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
    <div className="flex flex-col gap-3">
      {areas.map((area) => {
        const isEdit = editingId === area.id;

        return (
          <Card key={area.id}>
            <CardContent className="p-4 sm:p-5">
              {isEdit ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="font-semibold text-foreground">
                      Editing: {area.name}
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
                        onClick={() => handleSave(area)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="size-3.5 animate-spin mr-1" />
                        ) : (
                          <Save className="size-3.5 mr-1" />
                        )}
                        <span>Save</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Area Name
                      </label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Latitude
                      </label>
                      <Input
                        type="number"
                        step="any"
                        value={editLat ?? ""}
                        onChange={(e) =>
                          setEditLat(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-foreground">
                        Longitude
                      </label>
                      <Input
                        type="number"
                        step="any"
                        value={editLng ?? ""}
                        onChange={(e) =>
                          setEditLng(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {area.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          /{area.slug}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Order #{area.order}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Coords: {area.lat ?? "N/A"}, {area.lng ?? "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant={area.isActive ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(area)}
                    >
                      {area.isActive ? (
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
                      onClick={() => startEdit(area)}
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
