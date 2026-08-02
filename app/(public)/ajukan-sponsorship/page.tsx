import React from "react";
import { auth } from "@/lib/auth";
import { AjukanClient } from "./ajukan-client";

export default async function AjukanSponsorshipPage() {
  const session = await auth();
  
  const isClub = session?.user?.role === "CLUB";
  const clubId = session?.user?.id; // In actions we lookup the Club by userId.

  return <AjukanClient isClub={isClub} clubId={clubId} />;
}
