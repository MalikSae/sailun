import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

// FIX ENV STANDALONE:
// PM2 menjalankan app dari .next/standalone, sehingga Next.js bisa tidak membaca
// .env dari root project. Kalau DATABASE_URL kosong, baca .env manual dari path
// tetap yang aman untuk mode root project dan mode standalone.
if (!process.env.DATABASE_URL) {
  const cwd = process.cwd()
  const projectRoot = cwd.endsWith(path.join(".next", "standalone"))
    ? path.resolve(cwd, "..", "..")
    : cwd
  const envPaths = [path.join(projectRoot, ".env"), path.join(cwd, ".env")]

  for (const envPath of envPaths) {
    if (!fs.existsSync(envPath)) continue
    const content = fs.readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]+)"?\s*$/)
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
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
