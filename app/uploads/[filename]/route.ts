import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

function getProjectRoot() {
  const cwd = process.cwd();
  if (cwd.endsWith(path.join(".next", "standalone"))) {
    return path.resolve(cwd, "..", "..");
  }
  return cwd;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const filename = (await params).filename;
    
    // Resolve the real uploads directory
    const configuredDir = process.env.UPLOAD_DIR?.trim();
    const uploadsDir = configuredDir 
      ? (path.isAbsolute(configuredDir) ? configuredDir : path.resolve(getProjectRoot(), configuredDir))
      : path.join(getProjectRoot(), "public", "uploads");
      
    const filePath = path.join(uploadsDir, filename);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);
    
    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving upload file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
