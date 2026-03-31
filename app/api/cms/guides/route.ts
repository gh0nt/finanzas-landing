import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidCmsSessionToken, CMS_COOKIE_NAME } from "@/lib/cms/auth";
import {
  deleteGuidePost,
  getCmsEditableGuides,
  upsertGuidePost,
} from "@/lib/cms/guides";
import {
  estimateChapters,
  estimateReadingMinutes,
  resolveGuideCoverTheme,
  slugify,
} from "@/lib/cms/utils";
import type { GuideLevel, GuideStatus } from "@/lib/cms/types";
import { normalizeGuideCategory } from "@/lib/cms/categories";

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => String(tag).trim())
    .filter(Boolean)
    .slice(0, 20);
}

function validLevel(value: unknown): GuideLevel {
  if (value === "Avanzado" || value === "Intermedio") {
    return value;
  }

  return "Principiante";
}

function validStatus(value: unknown): GuideStatus {
  if (value === "published") {
    return "published";
  }

  return "draft";
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;

  if (!isValidCmsSessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const posts = await getCmsEditableGuides();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;

  if (!isValidCmsSessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;

  const title = String(payload.title ?? "").trim();
  const rawSlug = String(payload.slug ?? "").trim();
  const slug = slugify(rawSlug || title);
  const excerpt = String(payload.excerpt ?? "").trim();
  const content = String(payload.content_markdown ?? "");
  const category = normalizeGuideCategory(payload.category);
  const authorName = String(payload.author_name ?? "Equipo Editorial").trim();

  if (!title || !slug || !excerpt || !content || !authorName) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios para guardar la guia." },
      { status: 400 },
    );
  }

  const status = validStatus(payload.status);
  const nowIso = new Date().toISOString();
  const readingMinutes =
    Number(payload.reading_minutes) || estimateReadingMinutes(content);
  const chapters = Number(payload.chapters) || estimateChapters(content);
  const cover = resolveGuideCoverTheme(
    category,
    String(payload.cover_icon ?? ""),
    String(payload.cover_gradient ?? ""),
  );

  const result = await upsertGuidePost({
    slug,
    title,
    excerpt,
    content_markdown: content,
    category,
    level: validLevel(payload.level),
    cover_icon: cover.icon,
    cover_gradient: cover.gradient,
    seo_title: String(payload.seo_title ?? title).trim() || title,
    seo_description:
      String(payload.seo_description ?? excerpt).trim() || excerpt,
    canonical_url: String(payload.canonical_url ?? "").trim() || null,
    og_image_url: String(payload.og_image_url ?? "").trim() || null,
    tags: normalizeTags(payload.tags),
    author_name: authorName,
    author_role: String(payload.author_role ?? "").trim() || null,
    reading_minutes: readingMinutes,
    chapters,
    featured: Boolean(payload.featured),
    status,
    published_at:
      status === "published" ? String(payload.published_at ?? nowIso) : null,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slug: result.slug });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;

  if (!isValidCmsSessionToken(token)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const slug = String(payload.slug ?? "").trim();

  if (!slug) {
    return NextResponse.json(
      { error: "Debes indicar el slug de la guia a eliminar." },
      { status: 400 },
    );
  }

  const result = await deleteGuidePost(slug);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, slug: result.slug });
}
