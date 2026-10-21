import { getAdmin } from "@/lib/auth";
import { saveImage, UploadError } from "@/lib/uploads";

/*
 * POST multipart/form-data with a `file` field. Admin only. Returns { url } as an absolute URL,
 * because posts and testimonials are shown on ifleon.com, not on the dashboard's own domain.
 */
export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  // The session cookie is SameSite=Lax, which already blocks cross-site POSTs; this is a second check.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: "Cross-site upload refused." }, { status: 403 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file received." }, { status: 400 });
  }

  try {
    const publicPath = await saveImage(file);
    const base =
      process.env.PUBLIC_BASE_URL ||
      `${request.headers.get("x-forwarded-proto") ?? "http"}://${host ?? "localhost"}`;
    return Response.json({ url: new URL(publicPath, base).toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
