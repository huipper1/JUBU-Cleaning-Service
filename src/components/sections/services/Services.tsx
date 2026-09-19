"use client";

import Image from "next/image";

import { ArrowRight } from "lucide-react";

import type { Service } from "@/types/content";

import { Icon, SectionHeading } from "@/ui";

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  const handleSelectService = (serviceId: string) => {
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
    <section id="services" className="bg-white py-16 sm:py-20 lg:py-24" aria-label="Our Services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="OUR SERVICES"
          title="Cleaning Solutions for Every Space"
          description="We offer a wide range of cleaning services tailored to your needs."
        />

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service) => (
            <article
              key={service.id}
              className="group flex transform flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Card Image Header with 4:3 ratio */}
              <figure className="relative m-0 aspect-[4/3] w-full overflow-hidden bg-brand-pale-blue">
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="sr-only">{service.title}</figcaption>
              </figure>

              {/* Overlapping circular service icon badge */}
              <div className="relative z-10 -mt-6 ml-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-border/80 bg-white text-brand-blue shadow-md transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <Icon name={service.icon} className="h-6 w-6" />
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6 pt-3">
                <div>
                  <h3 className="mb-2 text-lg font-bold text-brand-navy transition-colors group-hover:text-brand-blue sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed font-normal text-brand-muted">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Get Quote Action Link */}
                <div className="border-t border-brand-border/60 pt-2">
                  <a
                    href={`#quote?service=${service.id}`}
                    onClick={() => handleSelectService(service.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue transition-all duration-200 hover:gap-2.5 hover:text-brand-blue-hover"
                    aria-label={`Get a quote for ${service.title}`}
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
