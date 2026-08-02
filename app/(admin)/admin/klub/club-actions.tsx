"use client";

import { useTransition } from "react";
import { ButtonGhost } from "@/components/ui/button-ghost";
import { Power, Eye, Pencil } from "lucide-react";
import { toggleClubStatus } from "@/app/actions/admin-club";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ClubActions({ clubId, currentStatus }: { clubId: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    if (confirm(`Ubah status klub menjadi ${currentStatus === "active" ? "inactive" : "active"}?`)) {
      startTransition(async () => {
        try {
          await toggleClubStatus(clubId);
          router.refresh();
        } catch (error: any) {
          alert(error.message);
        }
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <ButtonGhost onClick={handleToggle} disabled={isPending} title="Toggle Status">
        <Power className="w-4 h-4" />
      </ButtonGhost>
      <Link href={`/admin/klub/${clubId}`}>
        <ButtonGhost title="Lihat Detail">
          <Eye className="w-4 h-4" />
        </ButtonGhost>
      </Link>
      <Link href={`/admin/klub/${clubId}/edit`}>
        <ButtonGhost title="Edit Klub">
          <Pencil className="w-4 h-4" />
        </ButtonGhost>
      </Link>
    </div>
  );
}
