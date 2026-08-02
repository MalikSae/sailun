import React from "react";
import { ScanLine } from "lucide-react";

export function QrScanViewport({ isScanning }: { isScanning: boolean }) { 
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-graphite to-graphite-soft rounded-md border-2 border-accent overflow-hidden shadow-lg flex items-center justify-center">
      <div id="qr-reader" className="w-full h-full object-cover"></div>
      
      {!isScanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-graphite/80 z-10">
          <ScanLine className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
          <p className="font-body text-[13.5px] font-normal leading-[1.5] text-muted">Kamera tidak aktif</p>
        </div>
      )}
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent m-4 rounded-tl-sm z-20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent m-4 rounded-tr-sm z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent m-4 rounded-bl-sm z-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent m-4 rounded-br-sm z-20 pointer-events-none"></div>
    </div>
  ); 
}
