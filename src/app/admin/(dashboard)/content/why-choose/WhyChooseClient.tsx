"use client";

import { useState } from "react";

import { CheckCircle2, Loader2, Pencil, Save, ShieldCheck, X, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const isEdit = editingId === item.id;

        return (
          <Card key={item.id} className="flex flex-col justify-between">
            <CardContent className="p-5">
              {isEdit ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-semibold text-foreground">
                      Editing Pillar #{item.order}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        <X className="size-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleSave(item)} disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="mr-1 size-3.5 animate-spin" />
                        ) : (
                          <Save className="mr-1 size-3.5" />
                        )}
                        <span>Save</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">Title</label>
                    <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">Description</label>
                    <textarea
                      rows={3}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
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
                        <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                        <span className="font-mono text-[10px] text-muted-foreground">
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
                          <CheckCircle2 className="mr-1 size-3.5 text-emerald-500" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 size-3.5 text-muted-foreground" />
                          <span>Disabled</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  <div className="flex justify-end border-t pt-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                      <Pencil className="mr-1 size-3.5" />
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
