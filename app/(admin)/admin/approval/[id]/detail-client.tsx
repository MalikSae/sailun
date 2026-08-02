"use client";

import React, { useState } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { TierBadge } from "@/components/ui/tier-badge";
import { FormCard } from "@/components/ui/form-card";
import { ClubProfileCard } from "@/components/ui/club-profile-card";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonDanger } from "@/components/ui/button-danger";
import { ButtonGhost } from "@/components/ui/button-ghost";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { handleApprove, handleReject } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, FileText, Phone, User, Users } from "lucide-react";

export function DetailClient({ application }: { application: any }) {
  const router = useRouter();
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [tierFinal, setTierFinal] = useState(application.tierRekomendasi || "MICRO");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function openApprove() {
    setTierFinal(application.tierRekomendasi || "MICRO");
    setModalType("approve");
    setNotes("");
    setErrorMsg("");
  }

  function openReject() {
    setModalType("reject");
    setNotes("");
    setErrorMsg("");
  }

  function closeModal() {
    setModalType(null);
  }

  async function onConfirmApprove() {
    if (!tierFinal) {
      setErrorMsg("Tier Final harus diisi.");
      return;
    }
    setIsProcessing(true);
    const res = await handleApprove(application.id, tierFinal, notes);
    setIsProcessing(false);
    if (res.success) {
      closeModal();
      router.refresh();
    } else {
      setErrorMsg(res.error || "Gagal approve");
    }
  }

  async function onConfirmReject() {
    if (!notes.trim()) {
      setErrorMsg("Alasan penolakan wajib diisi.");
      return;
    }
    setIsProcessing(true);
    const res = await handleReject(application.id, notes);
    setIsProcessing(false);
    if (res.success) {
      closeModal();
      router.refresh();
    } else {
      setErrorMsg(res.error || "Gagal reject");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <ButtonGhost onClick={() => router.push("/admin/approval")} className="text-muted hover:text-ink pl-0 hover:bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke daftar
        </ButtonGhost>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-display-md font-display text-ink mb-2">Detail Pengajuan</h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-accent bg-canvas px-2 py-1 rounded text-sm border border-hairline">
              {application.nomorPengajuan}
            </span>
            <span className="text-muted text-body-sm">•</span>
            <span className="text-body-sm text-muted">
              Diajukan pada {new Date(application.createdAt).toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Info Klub */}
        <ClubProfileCard
          clubName={application.club.namaKomunitas}
          clubId={application.club.id}
          memberCount={application.club.jumlahAnggota}
          yearStart={application.club.tahunMobilMulai}
          yearEnd={application.club.tahunMobilAkhir}
          chairman={application.club.namaKetua}
          logoUrl={application.club.logoUrl}
          status={application.club.status}
          kota={application.club.kota || "Kota tidak disetel"}
          noWhatsappKetua={application.club.noWhatsappKetua || "-"}
          alamatSekretariat={application.club.alamatSekretariat || "-"}
          layout="stacked"
        />

        {/* Info Acara & Proposal */}
        <div className="space-y-8 flex-1">
          <FormCard title="Info Acara">
            <div className="space-y-4">
              <div>
                <p className="text-label-uppercase text-muted mb-1">Nama Acara</p>
                <p className="text-ink font-semibold">{application.namaAcara}</p>
              </div>
              <div>
                <p className="text-label-uppercase text-muted mb-1">Tanggal Acara</p>
                <p className="text-ink">{new Date(application.tanggalAcara).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-label-uppercase text-muted mb-1">Dana Diajukan</p>
                <p className="text-ink text-title-md text-accent font-mono">Rp {Number(application.danaDiajukan).toLocaleString("id-ID")}</p>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between p-4 bg-canvas rounded-lg border border-hairline">
                  <span className="text-ink font-medium">Dokumen Proposal</span>
                  {application.proposalUrl ? (
                    <a href={application.proposalUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-sm font-semibold">
                      Lihat Proposal ↗
                    </a>
                  ) : (
                    <span className="text-muted text-sm italic">Tidak ada proposal diunggah</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-label-uppercase text-muted mb-1">Tier Rekomendasi Sistem</p>
                <TierBadge tier={application.tierRekomendasi || "MICRO"} />
              </div>
            </div>
          </FormCard>

          <FormCard title="Keputusan">
            <div className="space-y-6">

              {application.status === "PENDING" && (
                <div className="pt-4 border-t border-hairline flex gap-3">
                  <ButtonPrimary onClick={openApprove} className="flex-1">
                    Setujui
                  </ButtonPrimary>
                  <ButtonDanger onClick={openReject} className="flex-1">
                    Tolak
                  </ButtonDanger>
                </div>
              )}

              {application.status !== "PENDING" && (
                <div className="pt-4 border-t border-hairline space-y-4">
                  {application.status === "APPROVED" && (
                    <div>
                      <p className="text-label-uppercase text-muted mb-1">Tier Final (Disetujui)</p>
                      <TierBadge tier={application.tierFinal} />
                    </div>
                  )}
                  {application.catatanAdmin && (
                    <div>
                      <p className="text-label-uppercase text-muted mb-1">
                        {application.status === "REJECTED" ? "Alasan Penolakan" : "Catatan Admin"}
                      </p>
                      <p className="text-ink bg-canvas p-3 rounded-lg text-sm border border-hairline whitespace-pre-wrap">
                        {application.catatanAdmin}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormCard>
        </div>
      </div>

      {/* Modal Approve */}
      <ConfirmationModal
        isOpen={modalType === "approve"}
        onClose={closeModal}
        onConfirm={onConfirmApprove}
        title="Approve Sponsorship"
        description={`Setujui pengajuan acara "${application.namaAcara}" oleh ${application.club.namaKomunitas}?`}
        confirmLabel={isProcessing ? "Memproses..." : "Approve"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-label-uppercase text-ink font-medium mb-1">Tier Final</label>
            <select
              value={tierFinal}
              onChange={(e) => setTierFinal(e.target.value)}
              className="w-full bg-canvas border border-hairline rounded-md px-3 py-2 text-ink outline-none"
            >
              <option value="MICRO">MICRO</option>
              <option value="SMALL">SMALL</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="BIG">BIG</option>
            </select>
          </div>
          <div>
            <label className="block text-label-uppercase text-ink font-medium mb-1">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-canvas border border-hairline rounded-md px-3 py-2 text-ink outline-none resize-none"
            />
          </div>
          {errorMsg && <p className="text-caption text-danger">{errorMsg}</p>}
        </div>
      </ConfirmationModal>

      {/* Modal Reject */}
      <ConfirmationModal
        isOpen={modalType === "reject"}
        onClose={closeModal}
        onConfirm={onConfirmReject}
        title="Tolak Sponsorship"
        description={`Tolak pengajuan acara "${application.namaAcara}" oleh ${application.club.namaKomunitas}?`}
        confirmLabel={isProcessing ? "Memproses..." : "Tolak"}
        isDanger={true}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-label-uppercase text-ink font-medium mb-1">
              Alasan Penolakan <span className="text-danger">*</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wajib diisi..."
              className="w-full bg-canvas border border-hairline rounded-md px-3 py-2 text-ink outline-none resize-none"
            />
          </div>
          {errorMsg && <p className="text-caption text-danger">{errorMsg}</p>}
        </div>
      </ConfirmationModal>
    </div>
  );
}
