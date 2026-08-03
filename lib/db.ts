import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

// FIX ENV STANDALONE:
// PM2 menjalankan app dari .next/standalone, sehingga Next.js hanya membaca
// .env dari folder ITU, bukan dari root project. Kalau DATABASE_URL kosong,
// fallback: baca .env manual dari folder parent (root project).
if (!process.env.DATABASE_URL) {
  for (const rel of [".env", "../.env", "../../.env"]) {
    const envPath = path.resolve(process.cwd(), rel)
    if (!fs.existsSync(envPath)) continue
    const content = fs.readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]+)"?\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
    if (process.env.DATABASE_URL) break
  }
  if (!process.env.DATABASE_URL) {
    console.error("[db] FATAL: DATABASE_URL tidak ditemukan di .env mana pun")
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
