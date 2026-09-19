import Link from "next/link";

import { FileText, MessageCircle, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/content";

interface StickyBottomBarProps {
  settings: SiteSettings;
}

export function StickyBottomBar({ settings }: StickyBottomBarProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage
  )}`;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-brand-navy-dark/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-md md:hidden"
      aria-label="Quick contact actions"
    >
      <div className="grid grid-cols-3 gap-2">
        {/* Direct Call Button */}
        <a
          href={`tel:${settings.phoneTel}`}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue px-2 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-blue-hover active:scale-95"
          aria-label={`Call JUBU at ${settings.phoneDisplay}`}
        >
          <Phone className="h-4 w-4 shrink-0" />
          <span>Call</span>
        </a>

        {/* WhatsApp Chat Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-green px-2 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-green-hover active:scale-95"
          aria-label="Chat with JUBU on WhatsApp"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Lead Quote Button */}
        <Link
          href="#quote"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-brand-navy-light px-2 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1E3B68] active:scale-95"
          aria-label="Request a free cleaning quote"
        >
          <FileText className="h-4 w-4 shrink-0" />
          <span>Quote</span>
        </Link>
      </div>
    </aside>
  );
}
