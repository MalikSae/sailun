import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOAD_PUBLIC_PATH = "/uploads";

function getProjectRoot() {
  const cwd = process.cwd();
  if (cwd.endsWith(path.join(".next", "standalone"))) {
    return path.resolve(cwd, "..", "..");
  }
  return cwd;
}

function getUploadsDir() {
  const configuredDir = process.env.UPLOAD_DIR?.trim();

  if (configuredDir) {
    return path.isAbsolute(configuredDir)
      ? configuredDir
      : path.resolve(getProjectRoot(), configuredDir);
  }

  return path.join(getProjectRoot(), "public", "uploads");
}

function extensionFromFileName(fileName: string, fallback: string) {
  const ext = path.extname(fileName).replace(".", "").toLowerCase();
  return ext || fallback;
}

async function ensureUploadsDir() {
  const uploadsDir = getUploadsDir();
  await fs.mkdir(uploadsDir, { recursive: true });
  return uploadsDir;
}

export async function uploadLogo(file: File): Promise<string> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, WEBP, and SVG are allowed.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const uploadsDir = await ensureUploadsDir();

  let finalBuffer = buffer;
  let ext = "webp";

  if (file.type === "image/svg+xml") {
    ext = "svg";
  } else {
    finalBuffer = await sharp(buffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }

  const filename = `${hash}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.writeFile(filePath, finalBuffer);

  return `${UPLOAD_PUBLIC_PATH}/${filename}`;
}

export async function uploadProposal(file: File): Promise<string> {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format file tidak valid. Hanya PDF, DOC, dan DOCX yang diperbolehkan.");
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran file terlalu besar. Maksimal 10MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const uploadsDir = await ensureUploadsDir();
  const ext = extensionFromFileName(file.name, "pdf");

  if (!["pdf", "doc", "docx"].includes(ext)) {
    throw new Error("Format file tidak valid. Hanya PDF, DOC, dan DOCX yang diperbolehkan.");
  }

  const filename = `proposal_${hash}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.writeFile(filePath, buffer);

  return `${UPLOAD_PUBLIC_PATH}/${filename}`;
}
