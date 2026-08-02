"use client";

import React, { useEffect, useState, useRef } from "react";
import { QrScanViewport } from "@/components/ui/qr-scan-viewport";
import { lookupMemberByQR } from "./actions";
import { useRouter } from "next/navigation";
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScannerState } from "html5-qrcode";
import { AlertCircle, UserCheck, Play, Square, Search } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonSecondary } from "@/components/ui/button-secondary";
import { TextInput } from "@/components/ui/text-input";

export default function ScanClient() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [manualId, setManualId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader", { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false });
    }

    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
            scannerRef.current.stop().catch(() => {});
          }
        } catch (e) {}
        
        try {
          scannerRef.current.clear();
        } catch (e) {}
        
        scannerRef.current = null;
      }
    };
  }, []);

  const handleScanSuccess = async (text: string) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await lookupMemberByQR(text);
      
      if (res.success && res.member) {
        setSuccessMsg(`Member ditemukan: ${res.member.nama} (${res.member.clubName})`);
        setTimeout(() => {
          router.push(`/dealer/transaksi/baru?memberId=${res.member.id}`);
        }, 1500);
      } else {
        setError(res.error || "Member tidak ditemukan");
      }
    } catch (e) {
      setError("Gagal memverifikasi data");
    }
  };

  const startScanner = async () => {
    if (!scannerRef.current) return;
    
    try {
      if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        return;
      }

      setError(null);
      setSuccessMsg(null);
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          try {
            if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
              await scannerRef.current.stop();
            }
          } catch (e) {}
          setIsScanning(false);
          
          await handleScanSuccess(decodedText);
        },
        (errorMessage) => {}
      );
      
      setIsScanning(true);
    } catch (err) {
      console.error(err);
      setError("Tidak dapat mengakses kamera. Pastikan memberikan izin akses.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current) return;
    try {
      if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
        await scannerRef.current.stop();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;

    if (isScanning) {
      await stopScanner();
    }

    setIsSubmitting(true);
    await handleScanSuccess(manualId.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card rounded-md p-6 shadow-sm border border-hairline relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-title-md font-display font-bold text-ink">Scan QR Code</h2>
          {isScanning ? (
            <ButtonSecondary type="button" onClick={stopScanner} className="text-danger border-danger hover:bg-danger-soft hover:text-danger">
              <Square className="w-4 h-4 mr-2" /> Stop Scan
            </ButtonSecondary>
          ) : (
            <ButtonPrimary type="button" onClick={startScanner}>
              <Play className="w-4 h-4 mr-2" /> Mulai Scan
            </ButtonPrimary>
          )}
        </div>

        <QrScanViewport isScanning={isScanning} />
        
        {error && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-danger-soft rounded-md">
            <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div>
              <p className="text-danger font-medium text-[13.5px]">Gagal</p>
              <p className="text-danger/80 text-[12.5px] mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-success-soft rounded-md">
            <UserCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-success font-medium text-[13.5px]">Berhasil</p>
              <p className="text-success/80 text-[12.5px] mt-0.5">{successMsg}</p>
              <p className="text-success/80 text-[12.5px] mt-1 italic">Mengarahkan ke form transaksi...</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card rounded-md p-6 shadow-sm border border-hairline relative">
        <h2 className="text-title-md font-display font-bold text-ink mb-2">Input Manual</h2>
        <p className="text-body-md text-muted mb-4">Masukkan ID Member secara manual jika kamera tidak dapat membaca QR.</p>
        
        <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <TextInput
              type="text"
              placeholder="Masukkan ID Member atau ID QR Card..."
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              disabled={isSubmitting || !!successMsg}
            />
          </div>
          <ButtonPrimary type="submit" disabled={isSubmitting || !manualId.trim() || !!successMsg}>
            <Search className="w-4 h-4 mr-2" /> 
            {isSubmitting ? "Mencari..." : "Cari Member"}
          </ButtonPrimary>
        </form>
      </div>

      <div className="flex flex-col gap-4 bg-accent-soft p-6 rounded-md border border-accent/20">
        <h3 className="font-display font-bold text-accent">Member Tidak Ditemukan?</h3>
        <p className="text-body-md text-body">
          Arahkan pembeli untuk mendaftar sendiri lewat link klub mereka.
        </p>
      </div>
    </div>
  );
}
