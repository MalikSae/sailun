import React from "react";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { ButtonDanger } from "@/components/ui/button-danger";
import { ButtonGhost } from "@/components/ui/button-ghost";
import { TextInput } from "@/components/ui/text-input";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { StatusBadge } from "@/components/ui/status-badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { StatCard } from "@/components/ui/stat-card";
import { FormCard } from "@/components/ui/form-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Download, Users } from "lucide-react";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink p-8 font-body">
      <div className="max-w-6xl mx-auto space-y-16">
        
        <header className="mb-12 border-b border-hairline pb-8">
          <h1 className="text-display-lg font-display font-bold text-graphite-text-strong bg-graphite p-4 rounded-lg mb-2">Sailun Community - UI Design System</h1>
          <p className="text-body-md text-muted">Preview komponen UI, tipografi, dan palet warna yang digunakan di seluruh aplikasi.</p>
        </header>

        {/* --- COLORS --- */}
        <section>
          <h2 className="text-display-md font-display mb-6 border-b border-hairline pb-2">1. Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-md bg-graphite text-graphite-text-strong">
              <span className="block font-bold">Graphite</span>
              <span className="font-mono text-xs opacity-70">Primary Dark</span>
            </div>
            <div className="p-4 rounded-md bg-graphite-soft text-white">
              <span className="block font-bold">Graphite Soft</span>
            </div>
            <div className="p-4 rounded-md bg-accent text-on-accent">
              <span className="block font-bold">Accent</span>
              <span className="font-mono text-xs opacity-70">Orange</span>
            </div>
            <div className="p-4 rounded-md bg-accent-soft text-accent-hover">
              <span className="block font-bold">Accent Soft</span>
            </div>
            <div className="p-4 rounded-md bg-canvas border border-hairline text-ink">
              <span className="block font-bold">Canvas</span>
              <span className="font-mono text-xs opacity-70">Background</span>
            </div>
            <div className="p-4 rounded-md bg-card border border-hairline text-ink">
              <span className="block font-bold">Card</span>
              <span className="font-mono text-xs opacity-70">Surface</span>
            </div>
            <div className="p-4 rounded-md bg-success text-white">
              <span className="block font-bold">Success</span>
            </div>
            <div className="p-4 rounded-md bg-danger text-white">
              <span className="block font-bold">Danger</span>
            </div>
          </div>
        </section>

        {/* --- TYPOGRAPHY --- */}
        <section>
          <h2 className="text-display-md font-display mb-6 border-b border-hairline pb-2">2. Typography</h2>
          <div className="space-y-6 bg-card p-6 border border-hairline rounded-lg">
            <div>
              <h1 className="text-display-xl font-display font-bold">Display XL - Sailun Community</h1>
              <p className="text-xs text-muted font-mono mt-1">font-display text-display-xl</p>
            </div>
            <div>
              <h2 className="text-display-lg font-display font-bold">Display LG - Section Header</h2>
              <p className="text-xs text-muted font-mono mt-1">font-display text-display-lg</p>
            </div>
            <div>
              <h3 className="text-display-md font-display font-semibold">Display MD - Card Title</h3>
              <p className="text-xs text-muted font-mono mt-1">font-display text-display-md</p>
            </div>
            <div>
              <h4 className="text-display-sm font-display font-semibold">Display SM - Subheading</h4>
              <p className="text-xs text-muted font-mono mt-1">font-display text-display-sm</p>
            </div>
            <div>
              <p className="text-body-lg">Body LG - Large text paragraph for prominent information.</p>
              <p className="text-xs text-muted font-mono mt-1">text-body-lg</p>
            </div>
            <div>
              <p className="text-body-md">Body MD - Standard text paragraph used across the application for general reading.</p>
              <p className="text-xs text-muted font-mono mt-1">text-body-md</p>
            </div>
            <div>
              <p className="text-body-sm">Body SM - Smaller text for secondary information.</p>
              <p className="text-xs text-muted font-mono mt-1">text-body-sm</p>
            </div>
            <div>
              <p className="text-caption text-muted">Caption - Helper text and timestamps.</p>
              <p className="text-xs text-muted font-mono mt-1">text-caption</p>
            </div>
          </div>
        </section>

        {/* --- BUTTONS --- */}
        <section>
          <h2 className="text-display-md font-display mb-6 border-b border-hairline pb-2">3. Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center bg-card p-6 border border-hairline rounded-lg">
            <ButtonPrimary>Button Primary</ButtonPrimary>
            <ButtonSecondary>Button Secondary</ButtonSecondary>
            <ButtonDanger>Button Danger</ButtonDanger>
            <ButtonGhost>Button Ghost</ButtonGhost>
            <ButtonPrimary disabled>Disabled</ButtonPrimary>
          </div>
        </section>

        {/* --- INPUTS --- */}
        <section>
          <h2 className="text-display-md font-display mb-6 border-b border-hairline pb-2">4. Form Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-card p-6 border border-hairline rounded-lg">
            <div className="space-y-4">
              <label className="block text-label-uppercase text-ink">Text Input</label>
              <TextInput placeholder="Placeholder text..." />
              <TextInput placeholder="Disabled state..." disabled />
            </div>
            <div className="space-y-4">
              <label className="block text-label-uppercase text-ink">Select Dropdown</label>
              <SelectDropdown>
                <option>Option 1</option>
                <option>Option 2</option>
              </SelectDropdown>
            </div>
          </div>
        </section>

        {/* --- BADGES --- */}
        <section>
          <h2 className="text-display-md font-display mb-6 border-b border-hairline pb-2">5. Badges & Status</h2>
          <div className="space-y-6 bg-card p-6 border border-hairline rounded-lg">
            <div>
              <h3 className="text-body-md font-semibold mb-3">Status Badges</h3>
              <div className="flex flex-wrap gap-4">
                <StatusBadge status="APPROVED" />
                <StatusBadge status="PENDING" />
                <StatusBadge status="REJECTED" />
                <StatusBadge status="VOIDED" />
                <StatusBadge status="FULFILLED" />
              </div>
            </div>
            <div>
              <h3 className="text-body-md font-semibold mb-3">Tier Badges</h3>
              <div className="flex flex-wrap gap-4">
                <TierBadge tier="PLATINUM" />
                <TierBadge tier="GOLD" />
                <TierBadge tier="SILVER" />
              </div>
            </div>
          </div>
        </section>

        {/* --- CARDS & WIDGETS --- */}
        <section>
          <h2 className="text-display-md font-display mb-6 border-b border-hairline pb-2">6. Cards & Data Display</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-body-md font-semibold mb-3">Stat Card</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Member" value="1,240" icon={Users} />
                <StatCard title="Total Transaksi" value="Rp 45.500.000" icon={Download} />
              </div>
            </div>

            <div>
              <h3 className="text-body-md font-semibold mb-3">Form Card</h3>
              <FormCard title="Example Form Card" description="Used for login or settings panels.">
                <div className="p-4 bg-canvas rounded border border-hairline text-center text-muted">
                  Form content goes here
                </div>
              </FormCard>
            </div>

            <div>
              <h3 className="text-body-md font-semibold mb-3">Empty State</h3>
              <EmptyState 
                title="Tidak Ada Data" 
                description="Belum ada transaksi yang dilakukan saat ini."
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
