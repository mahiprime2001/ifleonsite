import { readFile } from "node:fs/promises";
import { resolveUploadPath } from "@/lib/uploads";

/* Serves uploads publicly. File names are random and never reused, so they cache forever. */
export async function GET(_request: Request, { params }: RouteContext<"/uploads/[...path]">) {
  const resolved = resolveUploadPath((await params).path);
  if (!resolved) return new Response("Not found", { status: 404 });

  try {
    const body = await readFile(resolved.filePath);
    return new Response(body, {
      headers: {
        "Content-Type": resolved.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        // Sandboxing would stop the browser's PDF viewer, so PDFs get the strict policy without it.
        "Content-Security-Policy": resolved.isPdf ? "default-src 'none'; object-src 'self'" : "default-src 'none'; sandbox",
        ...(resolved.isPdf ? { "Content-Disposition": "inline" } : {}),
        // The public sites (ifleon.com, mahendra.ifleon.com) embed these files.
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
