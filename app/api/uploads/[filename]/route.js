import { readFile } from "fs/promises";
import { resolveUpload } from "../../../../lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

// GET /api/uploads/[filename] — serve a imagem salva no volume de uploads.
export async function GET(_request, { params }) {
  try {
    const filename = params.filename;
    const filePath = resolveUpload(filename);
    const data = await readFile(filePath);

    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
