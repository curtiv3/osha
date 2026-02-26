import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUserContext } from "@/lib/auth-context";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.userId || !context.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Use JPEG, PNG, or WebP." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum 10MB." },
      { status: 400 },
    );
  }

  // Use Vercel Blob if configured, otherwise fall back to base64 data URL
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(
      `incidents/${context.companyId}/${Date.now()}-${file.name}`,
      file,
      { access: "public" },
    );
    return NextResponse.json({ url: blob.url });
  }

  // Fallback for local dev: base64 data URL
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;
  return NextResponse.json({ url: dataUrl });
}
