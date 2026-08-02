import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

export async function uploadLogo(file: File): Promise<string> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, WEBP, and SVG are allowed.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate hash for filename
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  // Ensure uploads directory exists
  await fs.mkdir(uploadsDir, { recursive: true });

  let finalBuffer = buffer;
  let ext = "webp";

  if (file.type === "image/svg+xml") {
    ext = "svg";
  } else {
    // Process raster image with sharp
    finalBuffer = await sharp(buffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }

  const filename = `${hash}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.writeFile(filePath, finalBuffer);

  return `/uploads/${filename}`;
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

  // Batas 10MB
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran file terlalu besar. Maksimal 10MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate hash for filename
  const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadsDir, { recursive: true });

  let ext = "pdf";
  if (file.name.endsWith(".doc")) ext = "doc";
  else if (file.name.endsWith(".docx")) ext = "docx";

  const filename = `proposal_${hash}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  await fs.writeFile(filePath, buffer);

  return `/uploads/${filename}`;
}
