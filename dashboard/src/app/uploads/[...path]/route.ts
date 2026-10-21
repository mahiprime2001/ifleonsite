import { readFile } from "node:fs/promises";
import { resolveUploadPath } from "@/lib/uploads";

/* Serves uploaded images publicly. File names are random and never reused, so they cache forever. */
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
        "Content-Security-Policy": "default-src 'none'; sandbox",
        // The public site on ifleon.com embeds these images.
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
