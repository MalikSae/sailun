import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { ProfilForm } from "./form";

export default async function ClubProfilePage() {
  const session = await auth();
  if (!session || session.user.role !== "CLUB") {
    redirect("/login");
  }

  const club = await db.club.findFirst({
    where: { userId: session.user.id },
  });

  if (!club) {
    return <div className="p-8 text-ink text-center">Data klub tidak ditemukan.</div>;
  }

  return (
    <PageContainer className="space-y-8">
      <div>
        <h1 className="text-display-md font-display text-ink">Profil Klub</h1>
        <p className="text-body-md text-muted mt-2">
          Perbarui informasi komunitas dan logo klub Anda di sini.
        </p>
      </div>

      <ProfilForm club={club} />
    </PageContainer>
  );
}
