import Image from "next/image";

import type { TeamMember } from "@/types/content";

import { SectionHeading } from "@/ui";

interface TeamProps {
  members: TeamMember[];
}

export function Team({ members }: TeamProps) {
  return (
    <section id="team" className=" bg-[#eafaf5] py-16 sm:py-20 lg:py-24 " aria-label="Our Team">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="OUR TEAM"
          title="Meet Our Team"
          description="Trained, friendly and reliable professionals"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4">
          {members.map((member) => (
            <article
              key={member.id}
              className="group flex transform flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <figure className="relative m-0 aspect-square w-full overflow-hidden bg-brand-pale-blue">
                <Image
                  src={member.photo.src}
                  alt={member.photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="sr-only">{member.name}</figcaption>
              </figure>

              <div className="flex flex-1 flex-col items-start p-5 pt-4 text-start">
                <h3 className="mb-1 text-xl font-bold text-brand-navy transition-colors group-hover:text-brand-blue">
                  {member.name}
                </h3>
                <p className=" text-brand-blue sm:text-md">{member.role}</p>

                {member.bio && (
                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed font-normal text-brand-muted">
                    {member.bio}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
