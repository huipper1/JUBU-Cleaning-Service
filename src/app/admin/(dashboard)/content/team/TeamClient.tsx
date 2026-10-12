"use client";

import { useState } from "react";

import { CheckCircle2, Loader2, Pencil, Plus, Save, Trash2, X, XCircle } from "lucide-react";
import { toast } from "sonner";

import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  toggleTeamMemberActiveAction,
  updateTeamMemberAction
} from "./actions";

export interface TeamMemberItem {
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

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhotoSrc, setEditPhotoSrc] = useState("");
  const [editOrder, setEditOrder] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Add Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addRole, setAddRole] = useState("");
  const [addBio, setAddBio] = useState("");
  const [addPhotoSrc, setAddPhotoSrc] = useState("/images/placeholder/team-ahmed.png");
  const [addIsActive, setAddIsActive] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Delete Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const memberToDelete = members.find((m) => m.id === deleteConfirmId);

  const handleToggle = async (m: TeamMemberItem) => {
    const nextVal = !m.isActive;
    setMembers((prev) =>
      prev.map((item) => (item.id === m.id ? { ...item, isActive: nextVal } : item))
    );

    const res = await toggleTeamMemberActiveAction(m.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setMembers((prev) =>
        prev.map((item) => (item.id === m.id ? { ...item, isActive: !nextVal } : item))
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
    if (!editName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (!editRole.trim()) {
      toast.error("Please enter a role");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateTeamMemberAction(m.id, {
        name: editName.trim(),
        role: editRole.trim(),
        bio: editBio.trim() || undefined,
        photoSrc: editPhotoSrc,
        order: editOrder,
        isActive: m.isActive
      });

      if (res.success) {
        setMembers((prev) =>
          prev.map((item) =>
            item.id === m.id
              ? {
                  ...item,
                  name: editName.trim(),
                  role: editRole.trim(),
                  bio: editBio.trim() || undefined,
                  photoSrc: editPhotoSrc,
                  order: editOrder
                }
              : item
          )
        );
        toast.success("Team member updated successfully!");
        setEditingId(null);
      } else {
        toast.error(res.error ?? "Failed to save team member");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAdd = () => {
    setAddName("");
    setAddRole("");
    setAddBio("");
    setAddPhotoSrc("/images/placeholder/team-ahmed.png");
    setAddIsActive(true);
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) {
      toast.error("Please enter a name for the staff member");
      return;
    }
    if (!addRole.trim()) {
      toast.error("Please enter a job role / title");
      return;
    }

    setIsAdding(true);
    try {
      const res = await createTeamMemberAction({
        name: addName.trim(),
        role: addRole.trim(),
        bio: addBio.trim() || undefined,
        photoSrc: addPhotoSrc || "/images/placeholder/team-ahmed.png",
        order: members.length + 1,
        isActive: addIsActive
      });

      if (res.success && res.member) {
        setMembers((prev) => [...prev, res.member]);
        toast.success(`Team member ${res.member.name} created successfully!`);
        setIsAddOpen(false);
      } else {
        toast.error(res.error || "Failed to create team member");
      }
    } catch {
      toast.error("An unexpected error occurred while adding team member");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    setIsDeleting(true);
    try {
      const res = await deleteTeamMemberAction(deleteConfirmId);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== deleteConfirmId));
        if (editingId === deleteConfirmId) {
          setEditingId(null);
        }
        toast.success("Team member deleted successfully!");
        setDeleteConfirmId(null);
      } else {
        toast.error(res.error || "Failed to delete team member");
      }
    } catch {
      toast.error("An unexpected error occurred while deleting team member");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Header Strip */}
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Staff Members ({members.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage profiles, roles, bios, and 1:1 square portrait photos.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="gap-2 self-start bg-[#0070ba] text-white hover:bg-[#005ea6] sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Add Team Member</span>
        </Button>
      </div>

      {/* Grid of Team Members */}
      {members.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed p-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-[#0070ba]">
            <Plus className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No team members yet</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Add your professional cleaning staff so visitors can see your trusted team members.
          </p>
          <Button
            onClick={handleOpenAdd}
            className="mt-4 gap-2 bg-[#0070ba] text-white hover:bg-[#005ea6]"
          >
            <Plus className="size-4" />
            <span>Add First Team Member</span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {members.map((m) => {
            const isEdit = editingId === m.id;
            const initials = m.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Card key={m.id} className="flex flex-col justify-between">
                <CardContent className="p-5">
                  {isEdit ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-semibold text-foreground">
                          Editing: {m.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirmId(m.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                            <X className="size-4" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleSave(m)} disabled={isSaving}>
                            {isSaving ? (
                              <Loader2 className="mr-1 size-3.5 animate-spin" />
                            ) : (
                              <Save className="mr-1 size-3.5" />
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
                          <Label className="text-xs font-medium text-foreground">Name</Label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="e.g. Sajibul Islam"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label className="text-xs font-medium text-foreground">Role</Label>
                          <Input
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            placeholder="e.g. Team Supervisor"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xs font-medium text-foreground">Bio</Label>
                        <textarea
                          rows={2}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Short description or experience..."
                          className="w-full rounded-md border bg-background p-2 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
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
                            <h3 className="text-sm font-semibold text-foreground">{m.name}</h3>
                            <span className="text-xs font-medium text-primary">{m.role}</span>
                          </div>
                        </div>

                        <Button
                          variant={m.isActive ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => handleToggle(m)}
                        >
                          {m.isActive ? (
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

                      {m.bio && (
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {m.bio}
                        </p>
                      )}

                      <div className="flex items-center justify-between border-t pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(m.id)}
                          className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="mr-1 size-3.5" />
                          <span>Delete</span>
                        </Button>

                        <Button variant="outline" size="sm" onClick={() => startEdit(m)}>
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
      )}

      {/* Add Team Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Create a new cleaning staff profile to feature on your company website.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 py-2">
            <ImageCropUploader
              currentImageUrl={addPhotoSrc}
              folder="team"
              aspectRatio={1}
              label="Staff Portrait (1:1 Square Ratio)"
              onUploadComplete={(url) => setAddPhotoSrc(url)}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addName">Full Name *</Label>
                <Input
                  id="addName"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Sajibul Islam"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addRole">Role / Title *</Label>
                <Input
                  id="addRole"
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value)}
                  placeholder="e.g. Deep Cleaning Specialist"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addBio">Bio / Experience</Label>
              <textarea
                id="addBio"
                rows={3}
                value={addBio}
                onChange={(e) => setAddBio(e.target.value)}
                placeholder="e.g. Over 5 years of hospitality and residential deep cleaning experience in Dubai."
                className="w-full rounded-md border bg-background p-2.5 text-xs leading-relaxed text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="addIsActive"
                checked={addIsActive}
                onChange={(e) => setAddIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0070ba] focus:ring-[#0070ba]"
              />
              <Label htmlFor="addIsActive" className="cursor-pointer text-xs font-medium">
                Publish profile immediately (Active on live website)
              </Label>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAdding}
                className="gap-2 bg-[#0070ba] text-white hover:bg-[#005ea6]"
              >
                {isAdding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                <span>Add Member</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirmId)}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong className="font-semibold text-foreground">
                {memberToDelete?.name ?? "this staff member"}
              </strong>
              {memberToDelete?.role ? ` (${memberToDelete.role})` : ""}? This action cannot be
              undone and will remove them from the website.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              <span>Delete Member</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
