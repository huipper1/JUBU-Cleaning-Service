"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import type { Service } from "@/types/content";

import { Icon } from "@/ui";

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
    <section id="services" className="relative bg-white py-16 sm:py-20 lg:py-24" aria-label="Our Services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header matching reference */}
        <div className="mb-12 flex flex-col items-center text-center sm:mb-14">
          <h6 className="mb-2 text-xs font-bold tracking-wider text-[#16a34a] uppercase sm:text-sm">
            OUR SERVICES
          </h6>
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#081839] sm:text-4xl lg:text-5xl">
            Cleaning Solutions for Every Space
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            We offer a wide range of cleaning services tailored to your needs.
          </p>
        </div>

        {/* 6 Services Grid matching reference split card style */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`#quote?service=${service.id}`}
              onClick={() => handleSelectService(service.id)}
              aria-label={`Get a quote for ${service.title}`}
              className="group relative flex cursor-pointer overflow-hidden rounded-3xl border border-slate-200/90 bg-white  shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-[#0070ba]"
            >
              <div className="grid w-full grid-cols-2 items-center gap-3">

                {/* Left Half: Icon, Title, Description, Round Arrow Button */}
                <div className="flex h-full flex-col justify-between py-2 pl-2 md:py-4.5 md:pl-4.5">
                  <div>
                    {/* Square rounded icon button with soft blue bg */}
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100/70 text-[#0070ba] shadow-2xs transition-colors duration-300">
                      <Icon name={service.icon} className="h-5 w-5" />
                    </div>

                    <h3 className="mb-1.5 text-base font-extrabold leading-snug text-[#081839] transition-colors group-hover:text-[#0070ba] sm:text-lg">
                      {service.title}
                    </h3>

                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-500">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Circular Light Blue Arrow Button */}
                  <div className="pt-4">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100/80 text-[#0070ba] transition-all duration-200 group-hover:scale-105 group-hover:bg-[#0070ba] group-hover:text-white"
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Right Half: Rounded Image Preview */}
                <figure className="relative m-0 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
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
