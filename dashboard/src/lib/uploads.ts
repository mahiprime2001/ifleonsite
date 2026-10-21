import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * Image uploads live on disk (a Docker volume on the VPS) under UPLOAD_DIR/YYYY/MM/<random>.<ext>
 * and are served by app/uploads/[...path]/route.ts. SVG is deliberately not allowed: it can carry scripts.
 */
// turbopackIgnore: these paths are only known at runtime; without it the build traces (copies) the whole project.
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const IMAGE_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
} as const;
export type ImageExt = keyof typeof IMAGE_TYPES;

/* Identifies the format from the file's first bytes, so a renamed file can't pass as an image. */
function sniffImage(bytes: Buffer): ImageExt | null {
  const ascii = (start: number, end: number) => bytes.subarray(start, end).toString("latin1");
  if (bytes.length >= 8 && bytes.readUInt32BE(0) === 0x89504e47) return "png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "avif";
  return null;
}

export class UploadError extends Error {}

/* Saves an uploaded image and returns its public path, e.g. /uploads/2026/10/3f…a1.png */
export async function saveImage(file: File) {
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 5 MB or smaller.");

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) throw new UploadError("Only PNG, JPG, WebP, GIF or AVIF images are allowed.");

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const name = `${randomBytes(16).toString("hex")}.${ext}`;

  const dir = path.join(/* turbopackIgnore: true */ UPLOAD_DIR, year, month);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes, { flag: "wx" });
  return `/uploads/${year}/${month}/${name}`;
}

/* Strict pattern for served paths: no "..", no other folders, only names this module creates. */
const SERVED_PATH = /^(\d{4})\/(\d{2})\/([a-f0-9]{32})\.(png|jpg|webp|gif|avif)$/;

export function resolveUploadPath(segments: string[]) {
  const match = SERVED_PATH.exec(segments.join("/"));
  if (!match) return null;
  const ext = match[4] as ImageExt;
  return { filePath: path.join(/* turbopackIgnore: true */ UPLOAD_DIR, match[1], match[2], `${match[3]}.${ext}`), contentType: IMAGE_TYPES[ext] };
}
