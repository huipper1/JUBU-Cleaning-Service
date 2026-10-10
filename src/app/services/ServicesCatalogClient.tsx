"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import type { Service } from "@/types/content";

import { trackCtaClick, trackServiceSelect, trackWhatsAppClick } from "@/lib/analytics";
import { getPublicImageUrl, getServiceImageAlt } from "@/lib/content/image-url";

import { WhatsAppIcon } from "@/components/icons";

interface ServicesCatalogClientProps {
  services: Service[];
  whatsappNumber: string;
}

export function ServicesCatalogClient({ services, whatsappNumber }: ServicesCatalogClientProps) {
  const handleSelectService = (serviceId: string, serviceTitle: string, price?: number) => {
    // 1. Fire GA4 E-commerce select_item
    trackServiceSelect({
      item_id: serviceId,
      item_name: serviceTitle,
      item_category: "Cleaning Service",
      price: price || 199
    });

    // 2. Fire CTA Click
    trackCtaClick("book_service_card", "services_catalog", {
      service_id: serviceId,
      service_title: serviceTitle
    });

    // 3. Dispatch select-service to populate QuoteForm
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("select-service", {
          detail: { serviceId }
        })
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <article
          key={service.id}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#061e44]/80 p-6 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-2xl hover:shadow-sky-950/50"
        >
          <div>
            {/* Image Thumbnail */}
            <div className="relative mb-6 h-52 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
              <Image
                src={getPublicImageUrl(service.image.src, "/images/placeholder/gallery-home.png")}
                alt={getServiceImageAlt(service.title, service.image.alt)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Price Badge */}
              <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/95 px-3 py-1 text-xs font-black text-white shadow-lg shadow-emerald-950/50">
                <span className="text-[10px] font-bold text-emerald-100 uppercase">From</span>
                <span>{service.basePrice ?? 199} AED</span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold text-white transition-colors group-hover:text-sky-300">
              {service.title}
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-300 sm:text-sm">
              {service.shortDescription}
            </p>

            {service.longDescription && (
              <p className="mt-3 line-clamp-3 text-xs text-slate-400">{service.longDescription}</p>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <Link
              href="#quote"
              onClick={() => handleSelectService(service.id, service.title, service.basePrice)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sky transition-colors hover:text-white sm:text-sm"
            >
              <span>Book This Service</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hello JUBU, I would like to book ${service.title} in Dubai.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppClick("services_card_whatsapp", service.title, whatsappNumber)
              }
              className="rounded-full bg-emerald-500/20 p-2 text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-white"
              aria-label={`Inquire about ${service.title} via WhatsApp`}
            >
              <WhatsAppIcon className="size-4" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ServicesHeroActions({
  whatsappUrl,
  whatsappNumber
}: {
  whatsappUrl: string;
  whatsappNumber: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      <Link
        href="#quote"
        onClick={() => trackCtaClick("book_online_hero", "services_hero")}
        className="rounded-full bg-brand-green px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all hover:bg-brand-green-hover"
      >
        Book Online / Get Quote
      </Link>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("services_hero_whatsapp", undefined, whatsappNumber)}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
      >
        <WhatsAppIcon className="size-4" />
        <span>WhatsApp Inquiries</span>
      </a>
    </div>
  );
}
