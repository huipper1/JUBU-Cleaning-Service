"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Pencil, Save, X, Loader2 } from "lucide-react";
import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { toggleTeamMemberActiveAction, updateTeamMemberAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoSrc: string;
  photoAlt: string;
  order: number;
  isActive: boolean;
}

interface TeamClientProps {
  initialMembers: TeamMemberItem[];
}

export function TeamClient({ initialMembers }: TeamClientProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhotoSrc, setEditPhotoSrc] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (m: TeamMemberItem) => {
    const nextVal = !m.isActive;
    setMembers(
      members.map((item) =>
        item.id === m.id ? { ...item, isActive: nextVal } : item
      )
    );

    const res = await toggleTeamMemberActiveAction(m.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setMembers(
        members.map((item) =>
          item.id === m.id ? { ...item, isActive: !nextVal } : item
        )
      );
    } else {
      toast.success(`${m.name} is now ${nextVal ? "active" : "disabled"}`);
    }
  };

  const startEdit = (m: TeamMemberItem) => {
    setEditingId(m.id);
    setEditName(m.name);
    setEditRole(m.role);
    setEditBio(m.bio ?? "");
    setEditPhotoSrc(m.photoSrc);
    setEditOrder(m.order);
  };

  const handleSave = async (m: TeamMemberItem) => {
    setIsSaving(true);
    try {
      const res = await updateTeamMemberAction(m.id, {
        name: editName,
        role: editRole,
        bio: editBio || undefined,
        photoSrc: editPhotoSrc,
        order: editOrder,
        isActive: m.isActive,
      });

      if (res.success) {
        setMembers(
          members.map((item) =>
            item.id === m.id
              ? {
                  ...item,
                  name: editName,
                  role: editRole,
                  bio: editBio || undefined,
                  photoSrc: editPhotoSrc,
                  order: editOrder,
                }
              : item
          )
        );
        toast.success("Team member updated!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save team member");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {members.map((m) => {
        const isEdit = editingId === m.id;
        const initials = m.name.slice(0, 2).toUpperCase();

        return (
          <Card key={m.id} className="flex flex-col justify-between">
            <CardContent className="p-5">
              {isEdit ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <span className="font-semibold text-foreground text-xs">
                      Editing: {m.name}
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
                        onClick={() => handleSave(m)}
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

                  <ImageCropUploader
                    currentImageUrl={editPhotoSrc}
                    folder="team"
                    aspectRatio={1} // 1:1 enforced per CMS plan
                    label="Staff Portrait (1:1 Ratio)"
                    onUploadComplete={(url) => setEditPhotoSrc(url)}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-foreground">
                        Name
                      </label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-foreground">
                        Role
                      </label>
                      <Input
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-foreground">
                      Bio
                    </label>
                    <textarea
                      rows={2}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full rounded-md border bg-background p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-14 border">
                        <AvatarImage src={m.photoSrc} alt={m.photoAlt} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-foreground">
                          {m.name}
                        </h3>
                        <span className="text-xs text-primary font-medium">
                          {m.role}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant={m.isActive ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(m)}
                    >
                      {m.isActive ? (
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

                  {m.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {m.bio}
                    </p>
                  )}

                  <div className="pt-2 border-t flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(m)}
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
