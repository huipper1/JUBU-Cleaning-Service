import { getHero, getServices, getSettings, getWhyChoose } from "@/lib/content";

import { Header, StickyBottomBar } from "@/components/layouts";
import { Hero, Services, WhyChooseUs } from "@/components/sections";

export default async function Home() {
  const [settings, hero, services, whyChoose] = await Promise.all([
    getSettings(),
    getHero(),
    getServices(),
    getWhyChoose()
  ]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white pb-16 md:pb-0">
      <Header settings={settings} />
      <Hero content={hero} phoneTel={settings.phoneTel} phoneDisplay={settings.phoneDisplay} />
      <Services services={services} />
      <WhyChooseUs items={whyChoose} />
      <StickyBottomBar settings={settings} />
    </div>
  );
}
