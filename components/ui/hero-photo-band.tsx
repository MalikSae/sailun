import React from "react";
import { ButtonPrimary } from "@/components/ui/button-primary";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { FadeIn } from "@/components/ui/fade-in";

export async function HeroPhotoBand() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="relative overflow-hidden pt-16 pb-48 sm:pt-20 sm:pb-40 lg:pt-20 lg:pb-48 bg-graphite">
      {/* Background Image */}
      <img 
        src="/hero-sailun.webp" 
        alt="Sailun Community" 
        className="absolute inset-0 w-full h-full object-cover -scale-x-100" 
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="w-full lg:w-[50%] text-left mb-16 lg:mb-0">
          <FadeIn direction="up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-graphite/80 backdrop-blur-md px-4 py-1.5 border border-hairline-strong/30 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-label-uppercase text-graphite-text-strong tracking-widest font-semibold">Sailun Tire Community</span>
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={150}>
            <h1 className="text-display-2xl font-bebas text-graphite-text-strong mb-6 tracking-normal">
              SPONSORSHIP UNTUK KOMUNITASMU.
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={300}>
            <p className="text-title-lg font-body text-graphite-text mb-10 leading-relaxed">
              Punya acara komunitas? Ajukan sponsorship-nya di sini. Cukup isi datanya, tim kami langsung bantu prosesnya, dan kamu bisa dapat kabar dalam hitungan detik.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={450}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 sm:gap-6">
              <Link href="/ajukan-sponsorship" className="w-full sm:w-auto">
                <ButtonPrimary size="lg" className="w-full">Ajukan Sponsorship</ButtonPrimary>
              </Link>
              <Link 
                href="/login" 
                className="inline-flex h-[52px] w-full sm:w-auto items-center justify-center rounded-sm border border-graphite-text px-[32px] text-[16px] font-semibold tracking-[0.1px] text-graphite-text-strong transition-colors hover:bg-white/10 hover:border-white"
              >
                {isLoggedIn ? "Dashboard Akun" : "Sudah Punya Akun? Login"}
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
