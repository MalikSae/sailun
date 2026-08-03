import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan dev resources (HMR/webpack-hmr) diakses dari sailun.test
  // Tanpa ini, browser di sailun.test diblokir oleh Next.js dari koneksi WebSocket HMR
  allowedDevOrigins: ["sailun.test", "*.sailun.test"],

  experimental: {
    serverActions: {
      // Naikkan batas body size untuk Server Actions dari default 1MB ke 20MB
      // agar upload logo klub >5MB (dari kamera HP) bisa masuk ke server
      // sebelum dikompres otomatis oleh sharp (target ≤ 1024x1024, WebP)
      bodySizeLimit: "20mb",

      // Izinkan Server Action request dari sailun.test melewati CSRF check
      // karena ada Apache reverse proxy di depan (sailun.test → localhost:3000)
      allowedOrigins: ["sailun.test", "*.sailun.test", "sailun.nalaros.my.id", "*.sailun.nalaros.my.id"],
    },
  },

  // Diperlukan untuk deployment standalone di VPS + PM2 (AGENTS.md §11)
  output: "standalone",
};

export default nextConfig;

