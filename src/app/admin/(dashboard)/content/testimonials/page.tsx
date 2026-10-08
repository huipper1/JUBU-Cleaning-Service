import { prisma } from "@/lib/db/prisma";

import { AdminPageHeader } from "@/components/admin/page-header";

import { TestimonialsClient, type TestimonialItem } from "./TestimonialsClient";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const dbTestimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" }
  });

  const serialized: TestimonialItem[] = dbTestimonials.map((t) => ({
    id: t.id,
    name: t.name,
    location: t.location,
    service: t.service,
    rating: t.rating,
    quote: t.quote,
    avatarSrc: t.avatarSrc ?? undefined,
    order: t.order,
    isActive: t.isActive
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Customer Reviews"
        description="Manage customer testimonials, quotes, star ratings, and avatars shown across your website."
      />
      <TestimonialsClient initialTestimonials={serialized} />
    </div>
  );
}
