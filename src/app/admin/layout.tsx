import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "./login/actions";
import {
  LayoutDashboard,
  Inbox,
  Settings,
  Sparkles,
  Layers,
  MapPin,
  Globe2,
  HelpCircle,
  Users,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads Inbox", href: "/admin/leads", icon: Inbox },
  { label: "Area Landing Pages", href: "/admin/content/landing-pages", icon: Globe2 },
  { label: "Site Settings", href: "/admin/content/settings", icon: Settings },
  { label: "Hero Section", href: "/admin/content/hero", icon: Sparkles },
  { label: "Services", href: "/admin/content/services", icon: Layers },
  { label: "Service Areas", href: "/admin/content/areas", icon: MapPin },
  { label: "Why Choose Us", href: "/admin/content/why-choose", icon: ShieldCheck },
  { label: "Team Members", href: "/admin/content/team", icon: Users },
  { label: "Projects Gallery", href: "/admin/content/gallery", icon: ImageIcon }
];

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Middleware guards /admin, but if user hits layout without session, redirect to login
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-bold tracking-tight text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold">JUBU CMS</span>
          </Link>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 ring-1 ring-emerald-500/20">
            PROD
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Content & Operations
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Profile & Actions Footer */}
        <div className="border-t border-slate-800/80 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/40 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] text-slate-500">Open ↗</span>
          </a>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
            <div className="truncate text-xs font-medium text-white">{user.email}</div>
            <div className="text-[10px] text-emerald-400">Administrator</div>
            
            <form action={logoutAction} className="mt-3">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800/60 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-red-500/20 hover:text-red-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64 flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Admin</span>
            <span>/</span>
            <span className="font-medium text-white">Management Console</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Database Connected</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
