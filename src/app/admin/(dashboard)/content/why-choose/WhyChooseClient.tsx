"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, XCircle, Pencil, Save, X, Loader2 } from "lucide-react";
import { toggleWhyChooseActiveAction, updateWhyChooseAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    setItems(
      items.map((i) => (i.id === item.id ? { ...i, isActive: nextVal } : i))
    );

    const res = await toggleWhyChooseActiveAction(item.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setItems(
        items.map((i) =>
          i.id === item.id ? { ...i, isActive: !nextVal } : i
        )
      );
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
        isActive: item.isActive,
      });

      if (res.success) {
        setItems(
          items.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  title: editTitle,
                  description: editDesc,
                  order: editOrder,
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const isEdit = editingId === item.id;

        return (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardContent className="p-5">
              {isEdit ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="font-semibold text-foreground text-xs">
                      Editing Pillar #{item.order}
                    </span>
                    <div className="flex items-center gap-1.5">
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
                        onClick={() => handleSave(item)}
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

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">
                      Title
                    </label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ShieldCheck className="size-4" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Order #{item.order}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant={item.isActive ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(item)}
                    >
                      {item.isActive ? (
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
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item)}
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
