import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CMS_COOKIE_NAME, isValidCmsSessionToken } from "@/lib/cms/auth";
import { getSupabaseWriteClient } from "@/lib/cms/supabase";
import { slugify } from "@/lib/cms/utils";

const COVER_BUCKET = "posts-cms";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function getFileExtension(name: string) {
  const parts = name.toLowerCase().split(".");
  if (parts.length < 2) {
    return "jpg";
  }

  const ext = parts[parts.length - 1];
  if (!ext || ext.length > 6) {
    return "jpg";
  }

  return ext;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;

  if (!isValidCmsSessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseWriteClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "No hay configuracion de escritura para subir imagenes." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const rawSlug = String(formData.get("slug") ?? "post");
  const slug = slugify(rawSlug) || "post";

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Debes enviar una imagen valida." },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "El archivo debe ser una imagen." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "La imagen supera el limite de 5MB." },
      { status: 400 },
    );
  }

  const extension = getFileExtension(file.name);
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const objectPath = `${slug}/${uniqueId}.${extension}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(objectPath, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    return NextResponse.json(
      { error: error.message || "No se pudo subir la imagen." },
      { status: 500 },
    );
  }

  const { data: publicData } = supabase.storage
    .from(COVER_BUCKET)
    .getPublicUrl(objectPath);

  return NextResponse.json({
    ok: true,
    path: objectPath,
    url: publicData.publicUrl,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;

  if (!isValidCmsSessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseWriteClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "No hay configuracion de escritura para eliminar imagenes." },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as { path?: string };
  const objectPath = String(payload.path ?? "").trim();

  if (!objectPath) {
    return NextResponse.json(
      { error: "Debes enviar el path del archivo a eliminar." },
      { status: 400 },
    );
  }

  if (objectPath.includes("..")) {
    return NextResponse.json(
      { error: "Path de archivo invalido." },
      { status: 400 },
    );
  }

  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .remove([objectPath]);

  if (error) {
    return NextResponse.json(
      { error: error.message || "No se pudo eliminar la imagen." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
