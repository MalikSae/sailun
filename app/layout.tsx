import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-archivo",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
});

export const metadata: Metadata = {
  title: "Sailun Community Platform",
  description: "Platform community commerce untuk Sailun Tire Indonesia",
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${archivo.variable} ${jetbrainsMono.variable} ${inter.variable} ${bebasNeue.variable} antialiased bg-canvas text-ink font-body`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
