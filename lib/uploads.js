// Salva e resolve os arquivos de foto enviados pelos participantes.
// Os arquivos ficam num diretório persistido em volume (UPLOADS_DIR).
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

export const UPLOADS_DIR =
  process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");

export async function saveFile(file) {
  await mkdir(UPLOADS_DIR, { recursive: true });

  const ext = path.extname(file.name || "");
  const base = path
    .basename(file.name || "foto", ext)
    .replace(/[^a-z0-9-_]/gi, "_")
    .slice(0, 40);
  const filename = `${Date.now()}-${base}${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);

  return filename;
}

// Evita path traversal: usa apenas o nome do arquivo.
export function resolveUpload(filename) {
  return path.join(UPLOADS_DIR, path.basename(filename));
}

export async function deleteFile(filename) {
  if (!filename) return;
  try {
    await unlink(resolveUpload(filename));
  } catch {
    // arquivo já removido / inexistente — ignora
  }
}
