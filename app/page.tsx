import React from "react";
import { HeroPhotoBand } from "@/components/ui/hero-photo-band";
import { BenefitCard } from "@/components/ui/benefit-card";
import { Tag, Wrench, Gift } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas overflow-hidden">
      <HeroPhotoBand />
      
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <h2 className="text-display-lg font-display text-ink mb-4">Manfaat bagi Komunitas</h2>
            <p className="text-body-md text-muted max-w-2xl mx-auto font-body">
              Program sponsorship Sailun dirancang khusus untuk mendukung kegiatan komunitas otomotif di Indonesia dengan berbagai keuntungan nyata.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FadeIn direction="up" delay={100}>
            <BenefitCard 
              title="Diskon" 
              description="Nikmati potongan harga khusus dan promosi eksklusif yang hanya tersedia bagi member aktif klub saat membeli produk ban Sailun di dealer resmi kami."
              icon={<Tag className="w-8 h-8 text-accent" strokeWidth={1.5} />}
            />
          </FadeIn>
          <FadeIn direction="up" delay={250}>
            <BenefitCard 
              title="Pemeriksaan Ban Gratis" 
              description="Tim ahli teknis kami akan hadir langsung di event atau gathering tahunan Anda untuk memberikan layanan pengecekan kondisi ban menyeluruh secara cuma-cuma."
              icon={<Wrench className="w-8 h-8 text-accent" strokeWidth={1.5} />}
            />
          </FadeIn>
          <FadeIn direction="up" delay={400}>
            <BenefitCard 
              title="Merchandise Eksklusif" 
              description="Dapatkan apparel khusus, jaket touring premium, dan berbagai atribut Sailun menarik lainnya sebagai bentuk apresiasi bagi klub yang terpilih."
              icon={<Gift className="w-8 h-8 text-accent" strokeWidth={1.5} />}
            />
          </FadeIn>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-graphite to-graphite-soft py-8 border-t border-white/5">
        <FadeIn direction="up">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-body-sm text-graphite-text-strong/70 font-body">
              &copy; {new Date().getFullYear()} Copyright Hip Production - Integrated Company Event
            </p>
          </div>
        </FadeIn>
      </footer>
    </main>
  );
}
