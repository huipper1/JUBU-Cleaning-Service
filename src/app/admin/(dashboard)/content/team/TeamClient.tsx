"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Users, CheckCircle2, XCircle, Edit2, Save, X, Loader2 } from "lucide-react";
import { ImageCropUploader } from "@/components/admin/ImageCropUploader";
import { toggleTeamMemberActiveAction, updateTeamMemberAction } from "./actions";

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
    setMembers(members.map((item) => (item.id === m.id ? { ...item, isActive: nextVal } : item)));

    const res = await toggleTeamMemberActiveAction(m.id, nextVal);
    if (!res.success) {
      toast.error("Failed to update status");
      setMembers(members.map((item) => (item.id === m.id ? { ...item, isActive: !nextVal } : item)));
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
        isActive: m.isActive
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
                  order: editOrder
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
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Team Members</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage staff profiles and 1:1 square portrait photos with client-side cropping.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {members.map((m) => {
          const isEdit = editingId === m.id;

          return (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl flex flex-col justify-between"
            >
              {isEdit ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Editing {m.name}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg p-1 text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSave(m)}
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
                      currentImageUrl={editPhotoSrc}
                      folder="team"
                      aspectRatio={1} // 1:1 enforced per CMS plan
                      label="Staff Portrait (1:1 Ratio)"
                      onUploadComplete={(url) => setEditPhotoSrc(url)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300">Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300">Role</label>
                      <input
                        type="text"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300">Bio</label>
                    <textarea
                      rows={2}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-800 bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.photoSrc} alt={m.photoAlt} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{m.name}</h3>
                        <span className="text-xs text-emerald-400 font-medium">{m.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(m)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        m.isActive
                          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                      }`}
                    >
                      {m.isActive ? "Active" : "Disabled"}
                    </button>
                  </div>

                  {m.bio && (
                    <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">{m.bio}</p>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                    <button
                      onClick={() => startEdit(m)}
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
