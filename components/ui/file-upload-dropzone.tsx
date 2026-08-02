"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadDropzoneProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  label?: string;
  description?: string;
  isImage?: boolean;
  maxSizeMb?: number;
}

export function FileUploadDropzone({
  onFileSelect,
  accept = "image/jpeg, image/png, image/webp, image/svg+xml",
  label = "Logo Klub",
  description = "JPG, PNG, atau WEBP — ukuran besar otomatis dikompres",
  isImage = true,
  maxSizeMb = 10
}: FileUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    let objectUrl: string | null = null;
    if (isImage && (selectedFile.type.startsWith("image/") || selectedFile.name.match(/\.(jpg|jpeg|png|webp|svg)$/i))) {
      objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile, isImage]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Ukuran file terlalu besar (maksimal ${maxSizeMb}MB).`);
      return;
    }

    if (isImage && !file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
      setError("Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau SVG.");
      return;
    }
    
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
    // Kosongkan value agar file yang sama bisa dipilih lagi jika dihapus/diganti
    e.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
    setError(null);
  };

  // Generate a unique ID so multiple dropzones don't collide
  const inputId = React.useId();

  return (
    <div className="w-full">
      <label className="block text-label-uppercase font-body text-ink font-medium mb-2">{label}</label>
      <label
        htmlFor={inputId}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md transition-colors cursor-pointer ${dragActive ? "border-accent bg-canvas" : "border-hairline bg-card"
          } ${error ? "border-danger" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleChange}
        />

        {selectedFile ? (
          <div className="text-center">
            {isImage && previewUrl ? (
              <div className="mb-4 flex justify-center">
                <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-md border border-hairline shadow-sm" />
              </div>
            ) : null}
            <p className="font-body text-[13.5px] font-normal leading-[1.5] text-ink font-semibold truncate max-w-[200px] mx-auto mb-1">{selectedFile.name}</p>
            <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mb-4">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <div className="flex gap-4 justify-center">
              <span className="text-accent hover:text-accent-hover font-body text-[12.5px] font-normal leading-[1.5] font-semibold transition-colors">
                Ganti File
              </span>
              <button
                onClick={handleRemove}
                className="text-danger hover:text-danger/80 font-body text-[12.5px] font-normal leading-[1.5] font-semibold transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center pointer-events-none flex flex-col items-center">
            <UploadCloud className="w-10 h-10 text-muted mb-4" />
            <p className="font-body text-[12.5px] font-normal leading-[1.5] text-muted mb-2">Seret dan lepas file ke sini, atau</p>
            <span
              className="text-accent hover:text-accent-hover font-body text-[12.5px] font-normal leading-[1.5] font-semibold transition-colors"
            >
              Pilih File
            </span>
            <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-muted mt-2">{description}</p>
          </div>
        )}
      </label>
      {error && <p className="font-body text-[11.5px] font-normal leading-[1.4] tracking-[0.15px] text-danger mt-2">{error}</p>}
    </div>
  );
}
