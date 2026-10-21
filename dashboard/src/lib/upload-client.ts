/* Browser-side helper: uploads one image to /api/uploads and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error || `Upload failed (${res.status}).`);
  return data.url;
}
