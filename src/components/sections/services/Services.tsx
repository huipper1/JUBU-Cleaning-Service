"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Clock } from "lucide-react";

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
  const handleSelectService = (
    e: React.MouseEvent<HTMLAnchorElement>,
    serviceId: string,
    serviceTitle: string
  ) => {
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

      const target = document.getElementById("quote") || document.getElementById("booking-form");
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#quote?service=${serviceId}`);
      }
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
              href="#quote"
              onClick={(e) => handleSelectService(e, service.id, service.title)}
              aria-label={`Book ${service.title} - Get a quote`}
              className="group relative flex cursor-pointer overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-[#0070ba]"
            >
              <div className="flex w-full flex-col sm:grid sm:grid-cols-2 sm:items-center sm:gap-3">
                {/* Image: Top Banner on mobile, Right column on tablet/desktop */}
                <figure className="relative m-0 aspect-16/10 w-full overflow-hidden bg-slate-100 sm:order-2 sm:aspect-4/5 sm:rounded-2xl">
                  <Image
                    src={getPublicImageUrl(
                      service.image.src,
                      "/images/placeholder/gallery-home.png"
                    )}
                    alt={getServiceImageAlt(service.title, service.image.alt)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="sr-only">{service.title}</figcaption>
                </figure>

                {/* Content: Below image on mobile, Left column on tablet/desktop */}
                <div className="flex h-full flex-col justify-between p-4.5 sm:order-1 sm:py-4.5 sm:pl-4.5 sm:pr-0">
                  <div>
                    {/* Square rounded icon button with soft blue bg */}
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100/70 text-[#0070ba] shadow-2xs transition-colors duration-300">
                      <Icon name={service.icon} className="h-5 w-5" />
                    </div>

                    <h3 className="mb-1.5 text-base leading-snug font-extrabold text-[#081839] transition-colors group-hover:text-[#0070ba] sm:text-lg">
                      {service.title}
                    </h3>

                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 sm:line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Circular Light Blue Arrow Button & Duration Badge */}
                  <div className="flex items-center justify-between gap-1.5 pt-4">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100/80 text-[#0070ba] transition-all duration-200 group-hover:scale-105 group-hover:bg-[#0070ba] group-hover:text-white"
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100/80 bg-sky-50/90 px-2.5 py-1 text-[12px] font-semibold text-slate-600 transition-colors group-hover:border-sky-200 group-hover:bg-sky-100/80 group-hover:text-[#0070ba] sm:text-[13px]">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#0070ba]" />
                      <span className="whitespace-nowrap">Min. 4 Hours</span>
                    </span>
                  </div>
                </div>
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
