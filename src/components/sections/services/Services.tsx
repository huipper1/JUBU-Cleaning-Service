"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Sparkles } from "lucide-react";

import type { Service } from "@/types/content";

import { trackServiceSelect } from "@/lib/analytics";
import { getPublicImageUrl, getServiceImageAlt } from "@/lib/content/image-url";

import { Icon, SectionHeading } from "@/ui";

interface ServicesProps {
  services: Service[];
  title?: string;
  description?: string;
}

export function Services({
  services,
  title = "Cleaning Solutions for Every Space",
  description = "From deep home sanitization to specialized commercial cleaning, Our trained cleaning team delivers reliable and professional cleaning results with care and attention to detail."
}: ServicesProps) {
  const handleSelectService = (serviceId: string, serviceTitle: string) => {
    // Fire DataLayer select_item event
    trackServiceSelect({
      item_id: serviceId,
      item_name: serviceTitle,
      item_category: "Cleaning Service"
    });

    if (typeof window !== "undefined") {
      // Dispatch custom event for the QuoteForm listener
      window.dispatchEvent(
        new CustomEvent("select-service", {
          detail: { serviceId }
        })
      );
    }
  };

  return (
    <section
      id="services"
      className="relative bg-white py-16 sm:py-20 lg:py-24"
      aria-label="Our Services"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading badge="OUR SERVICES" title={title} description={description} />

        {/* 6 Services Grid matching reference split card style */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`#quote?service=${service.id}`}
              onClick={() => handleSelectService(service.id, service.title)}
              aria-label={`Get a quote for ${service.title}`}
              className="group relative flex cursor-pointer overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-[#0070ba]"
            >
              <div className="grid w-full grid-cols-2 items-center gap-3">
                {/* Left Half: Icon, Title, Description, Round Arrow Button */}
                <div className="flex h-full flex-col justify-between py-2.5 pl-2.5 md:py-4.5 md:pl-4.5">
                  <div>
                    {/* Square rounded icon button with soft blue bg */}
                    <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100/70 text-[#0070ba] shadow-2xs transition-colors duration-300 sm:h-11 sm:w-11">
                      <Icon name={service.icon} className="h-5 w-5" />
                    </div>

                    <h3 className="mb-1 text-base leading-snug font-extrabold text-[#081839] transition-colors group-hover:text-[#0070ba] sm:text-lg">
                      {service.title}
                    </h3>

                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Bottom Action: Price & Circular Arrow Button */}
                  <div className="pt-3">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-[11px] font-bold text-[#0070ba] transition-all group-hover:bg-[#0070ba] group-hover:text-white">
                        <Sparkles className="size-3 shrink-0" />
                        <span className="truncate">Customize</span>
                      </span>

                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100/80 text-[#0070ba] transition-all duration-200 group-hover:scale-105 group-hover:bg-[#0070ba] group-hover:text-white"
                        aria-hidden="true"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Half: Rounded Image Preview with Starting Price Badge */}
                <figure className="relative m-0 aspect-4/5 w-full overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={getPublicImageUrl(
                      service.image.src,
                      "/images/placeholder/gallery-home.png"
                    )}
                    alt={getServiceImageAlt(service.title, service.image.alt)}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating Starting Price Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/95 px-2.5 py-0.5 text-[11px] font-extrabold text-[#081839] shadow-md backdrop-blur-xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">From</span>
                    <span className="text-[#0070ba]">{service.basePrice ?? 199} AED</span>
                  </div>
                  <figcaption className="sr-only">{service.title}</figcaption>
                </figure>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Services Center Button with green accent sparks */}
        {/* <div className="mt-12 flex items-center justify-center sm:mt-14">
          <div className="relative inline-flex items-center">
            <Link
              href="#quote"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#005ea6] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/20 transition-all duration-200 hover:bg-[#004e8c] hover:shadow-lg active:scale-98 sm:text-base"
            >
              <span>View All Services</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="pointer-events-none absolute -right-7 -top-1 select-none text-[#00a651]">
              <span className="absolute -top-1 -right-1 block h-3 w-0.5 rotate-[45deg] rounded-full bg-[#00a651]" />
              <span className="absolute top-2.5 right-2 block h-3 w-0.5 rotate-[90deg] rounded-full bg-[#00a651]" />
              <span className="absolute top-6 right-0 block h-3 w-0.5 rotate-[135deg] rounded-full bg-[#00a651]" />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
