import React from "react";
import { ButtonPrimary } from "./button-primary";

export function RedeemCatalogCard({ title, points, imageUrl, onRedeem }: { title: string, points: number, imageUrl?: string, onRedeem?: () => void }) { 
  return (
    <div className="bg-card rounded-md px-[16px] py-[16px] border border-hairline flex flex-col gap-4">
      {imageUrl && <img src={imageUrl} alt={title} className="w-full h-32 object-cover rounded-sm bg-canvas" />}
      <div>
        <h3 className="text-title-md font-display text-ink">{title}</h3>
        <p className="text-accent font-semibold font-body text-[13.5px] leading-[1.5]">{points} Poin</p>
      </div>
      <ButtonPrimary className="w-full" onClick={onRedeem}>Tukar Poin</ButtonPrimary>
    </div>
  ); 
}
