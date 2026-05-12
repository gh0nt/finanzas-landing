import {
  getSupabaseReadClient,
  getSupabaseConfigInfo,
} from "@/lib/cms/supabase";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import type { GuidePost, GuidePostUpsertInput } from "@/lib/cms/types";
import { resolveGuideCoverTheme } from "@/lib/cms/utils";

export type CmsDatabaseStatus = {
  connected: boolean;
  message: string;
  writeEnabled: boolean;
  writeMessage: string;
  hasUrl: boolean;
  hasPublicKey: boolean;
  hasServiceRoleKey: boolean;
};

const CMS_DB_STATUS_TTL_MS = 30_000;
const CMS_EDITABLE_GUIDES_TTL_MS = 20_000;
const COVER_BUCKET = "posts-cms";

let cmsDbStatusCache: {
  expiresAt: number;
  value: CmsDatabaseStatus;
} | null = null;

let cmsEditableGuidesCache: {
  expiresAt: number;
  value: GuidePost[];
} | null = null;

type DeleteGuideTraceStep = {
  step: string;
  ok: boolean;
  detail?: string;
};

export type DeleteGuidePostResult =
  | {
      ok: true;
      slug: string;
      deleted: {
        id: string;
        slug: string;
        title: string;
      };
      storagePath: string | null;
      warnings: string[];
      trace: DeleteGuideTraceStep[];
    }
  | {
      ok: false;
      error: string;
      code:
        | "missing_slug"
        | "fallback_post"
        | "missing_admin_client"
        | "delete_failed"
        | "not_deleted";
      trace: DeleteGuideTraceStep[];
    };

const fallbackGuides: GuidePost[] = [
  {
    id: "fallback-1",
    slug: "guia-completa-cuentas-de-ahorro-colombia",
    title: "Guia completa: Como elegir la mejor cuenta de ahorros en Colombia",
    excerpt:
      "Analizamos tasas E.A., cuotas de manejo y coberturas del Fogafin para ayudarte a elegir mejor.",
    content_markdown: `## Que es una cuenta de ahorros\n\nUna cuenta de ahorros es tu base de liquidez para el corto plazo.\n\n## Como comparar\n\nRevisa tasa E.A., costos ocultos y facilidad de uso.\n\n## Riesgo y cobertura\n\nConfirma que la entidad este cubierta por Fogafin.`,
    category: "Ahorro",
    level: "Principiante",
    cover_icon: "savings",
    cover_gradient: "linear-gradient(135deg,#064e3b 0%, #047857 100%)",
    seo_title: "Guia Completa de Cuentas de Ahorro en Colombia",
    seo_description:
      "Aprende a elegir una cuenta de ahorros en Colombia comparando tasas, costos y beneficios.",
    canonical_url: null,
    og_image_url: null,
    tags: ["ahorro", "cuentas"],
    author_name: "Finanzas sin Ruido",
    author_role: "Equipo Editorial",
    reading_minutes: 10,
    chapters: 3,
    featured: true,
    status: "published",
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function withGuideVisualDefaults(guide: GuidePost): GuidePost {
  const cover = resolveGuideCoverTheme(
    guide.category,
    guide.cover_icon,
    guide.cover_gradient,
  );

  return {
    ...guide,
    cover_icon: cover.icon,
    cover_gradient: cover.gradient,
  };
}

function isFallbackGuideSlug(slug: string) {
  return fallbackGuides.some((guide) => guide.slug === slug);
}

function getCoverStoragePathFromPublicUrl(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const marker = `/storage/v1/object/public/${COVER_BUCKET}/`;
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(
      parsedUrl.pathname.slice(markerIndex + marker.length),
    );
  } catch {
    return null;
  }
}

function mergeWithFallbackGuides(dbGuides: GuidePost[]) {
  const bySlug = new Map<string, GuidePost>();

  // Keep DB records as source of truth when a slug exists in both places.
  for (const guide of dbGuides) {
    bySlug.set(guide.slug, guide);
  }

  for (const guide of fallbackGuides) {
    if (!bySlug.has(guide.slug)) {
      bySlug.set(guide.slug, guide);
    }
  }

  return Array.from(bySlug.values()).map(withGuideVisualDefaults);
}

function filterByCategory(guides: GuidePost[], category?: string) {
  if (!category || category === "Todas") {
    return guides;
  }

  return guides.filter((guide) => guide.category === category);
}

export async function getPublishedGuides(
  category?: string,
): Promise<GuidePost[]> {
  const supabase = getSupabaseReadClient();

  if (!supabase) {
    return filterByCategory(fallbackGuides.map(withGuideVisualDefaults), category);
  }

  const query = supabase
    .from("guide_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  const { data, error } = await query;

  if (error) {
    return filterByCategory(fallbackGuides.map(withGuideVisualDefaults), category);
  }

  const merged = mergeWithFallbackGuides((data ?? []) as GuidePost[]);
  return filterByCategory(merged, category);
}

export async function getFeaturedGuide() {
  const guides = await getPublishedGuides();
  return guides.find((guide) => guide.featured) ?? guides[0] ?? null;
}

export async function getGuideBySlug(slug: string): Promise<GuidePost | null> {
  const supabase = getSupabaseReadClient();

  if (!supabase) {
    const fallback =
      fallbackGuides.find((guide) => guide.slug === slug) ?? null;
    return fallback ? withGuideVisualDefaults(fallback) : null;
  }

  const { data } = await supabase
    .from("guide_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!data) {
    const fallback =
      fallbackGuides.find((guide) => guide.slug === slug) ?? null;
    return fallback ? withGuideVisualDefaults(fallback) : null;
  }

  return withGuideVisualDefaults(data as GuidePost);
}

export async function getRelatedGuides(
  slug: string,
  category: string,
  limit = 3,
): Promise<GuidePost[]> {
  const all = await getPublishedGuides(category);
  return all.filter((guide) => guide.slug !== slug).slice(0, limit);
}

export async function upsertGuidePost(input: GuidePostUpsertInput) {
  let supabase: ReturnType<typeof getSupabaseAdminClient>;

  try {
    supabase = getSupabaseAdminClient();
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo inicializar Supabase admin.",
    };
  }

  const { error } = await supabase.from("guide_posts").upsert(
    {
      ...input,
      featured: input.featured ?? false,
      tags: input.tags ?? [],
    },
    { onConflict: "slug" },
  );

  if (error) {
    return {
      ok: false,
      error: error?.message ?? "No se pudo guardar la guia.",
    };
  }

  // Invalidate short-lived caches to reflect fresh content after writes.
  cmsEditableGuidesCache = null;
  cmsDbStatusCache = null;

  return {
    ok: true,
    slug: input.slug,
  };
}

export async function deleteGuidePost(
  slug: string,
): Promise<DeleteGuidePostResult> {
  const normalizedSlug = slug.trim();
  const trace: DeleteGuideTraceStep[] = [
    { step: "normalize_slug", ok: Boolean(normalizedSlug) },
  ];

  if (!normalizedSlug) {
    return {
      ok: false,
      error: "Debes indicar el slug de la guia a eliminar.",
      code: "missing_slug",
      trace,
    };
  }

  if (isFallbackGuideSlug(normalizedSlug)) {
    trace.push({
      step: "fallback_guard",
      ok: false,
      detail: "El slug pertenece a una guia base definida en codigo.",
    });

    return {
      ok: false,
      error: "La guia base no se puede eliminar desde el CMS.",
      code: "fallback_post",
      trace,
    };
  }

  let supabase: ReturnType<typeof getSupabaseAdminClient>;

  try {
    supabase = getSupabaseAdminClient();
  } catch (error) {
    trace.push({
      step: "admin_client",
      ok: false,
      detail: error instanceof Error ? error.message : "No se pudo inicializar Supabase admin.",
    });

    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "No se pudo inicializar Supabase admin.",
      code: "missing_admin_client",
      trace,
    };
  }

  trace.push({ step: "admin_client", ok: true });

  const { data: existingPost, error: lookupError } = await supabase
    .from("guide_posts")
    .select("slug, og_image_url")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  trace.push({
    step: "lookup_post_before_delete",
    ok: !lookupError,
    detail: lookupError
      ? lookupError.message
      : existingPost
        ? "Post visible para el cliente admin."
        : "No visible antes de eliminar; puede ser RLS de SELECT o slug inexistente.",
  });

  const storagePath = getCoverStoragePathFromPublicUrl(
    (existingPost as Pick<GuidePost, "og_image_url"> | null)?.og_image_url,
  );

  const { data, error } = await supabase
    .from("guide_posts")
    .delete()
    .eq("slug", normalizedSlug)
    .select("id, slug, title");

  if (error) {
    trace.push({
      step: "delete_database_row",
      ok: false,
      detail: error.message,
    });

    return {
      ok: false,
      error: error.message ?? "No se pudo eliminar la guia.",
      code: "delete_failed",
      trace,
    };
  }

  const deletedRows = (data ?? []) as Array<{
    id: string;
    slug: string;
    title: string;
  }>;

  trace.push({
    step: "delete_database_row",
    ok: deletedRows.length > 0,
    detail: `Filas eliminadas: ${deletedRows.length}.`,
  });

  if (!deletedRows.length) {
    return {
      ok: false,
      error:
        "No guide was deleted. The slug does not exist or the delete operation did not match any row.",
      code: "not_deleted",
      trace,
    };
  }

  const warnings: string[] = [];

  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from(COVER_BUCKET)
      .remove([storagePath]);

    trace.push({
      step: "delete_cover_storage_object",
      ok: !storageError,
      detail: storageError ? storageError.message : storagePath,
    });

    if (storageError) {
      warnings.push(
        `La guia fue eliminada, pero no se pudo borrar la imagen ${storagePath}: ${storageError.message}`,
      );
    }
  } else {
    trace.push({
      step: "delete_cover_storage_object",
      ok: true,
      detail: "No hay imagen de posts-cms asociada o no es una URL publica del bucket.",
    });
  }

  cmsEditableGuidesCache = null;
  cmsDbStatusCache = null;
  trace.push({ step: "invalidate_server_cms_cache", ok: true });

  return {
    ok: true,
    slug: normalizedSlug,
    deleted: deletedRows[0],
    storagePath,
    warnings,
    trace,
  };
}

export async function getCmsDatabaseStatus() {
  const now = Date.now();
  if (cmsDbStatusCache && cmsDbStatusCache.expiresAt > now) {
    return cmsDbStatusCache.value;
  }

  const readClient = getSupabaseReadClient();
  const config = getSupabaseConfigInfo();
  let adminClientReady = false;

  try {
    getSupabaseAdminClient();
    adminClientReady = true;
  } catch {
    adminClientReady = false;
  }

  if (!readClient) {
    const result: CmsDatabaseStatus = {
      connected: false,
      message:
        "Faltan variables para lectura de Supabase (URL + ANON/PUBLISHABLE key).",
      writeEnabled: false,
      writeMessage: "Escritura deshabilitada: falta SUPABASE_SERVICE_ROLE_KEY.",
      ...config,
    };

    cmsDbStatusCache = {
      value: result,
      expiresAt: now + CMS_DB_STATUS_TTL_MS,
    };

    return result;
  }

  const { error } = await readClient
    .from("guide_posts")
    .select("id", { head: true, count: "exact" });

  if (error) {
    const result: CmsDatabaseStatus = {
      connected: false,
      message: `Sin acceso a guide_posts: ${error.message}`,
      writeEnabled: adminClientReady,
      writeMessage: adminClientReady
        ? "Escritura CMS habilitada via SUPABASE_SERVICE_ROLE_KEY server-only."
        : "Escritura CMS deshabilitada: falta SUPABASE_SERVICE_ROLE_KEY.",
      ...config,
    };

    cmsDbStatusCache = {
      value: result,
      expiresAt: now + CMS_DB_STATUS_TTL_MS,
    };

    return result;
  }

  const result: CmsDatabaseStatus = {
    connected: true,
    message: "Lectura conectada a Supabase y tabla guide_posts accesible.",
    writeEnabled: adminClientReady,
    writeMessage: adminClientReady
      ? "Escritura CMS habilitada via SUPABASE_SERVICE_ROLE_KEY server-only."
      : "Escritura CMS deshabilitada: falta SUPABASE_SERVICE_ROLE_KEY.",
    ...config,
  };

  cmsDbStatusCache = {
    value: result,
    expiresAt: now + CMS_DB_STATUS_TTL_MS,
  };

  return result;
}

export async function getCmsEditableGuides(): Promise<GuidePost[]> {
  const now = Date.now();
  if (cmsEditableGuidesCache && cmsEditableGuidesCache.expiresAt > now) {
    return cmsEditableGuidesCache.value;
  }

  const readClient = getSupabaseReadClient();

  try {
    const adminClient = getSupabaseAdminClient();
    const { data, error } = await adminClient
      .from("guide_posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error) {
      const result = mergeWithFallbackGuides((data ?? []) as GuidePost[]);
      cmsEditableGuidesCache = {
        value: result,
        expiresAt: now + CMS_EDITABLE_GUIDES_TTL_MS,
      };
      return result;
    }
  } catch {
    // Fall back to public reads when the server-only service role key is absent.
  }

  if (readClient) {
    const published = await getPublishedGuides();
    const result = mergeWithFallbackGuides(published);
    cmsEditableGuidesCache = {
      value: result,
      expiresAt: now + CMS_EDITABLE_GUIDES_TTL_MS,
    };
    return result;
  }

  cmsEditableGuidesCache = {
    value: fallbackGuides.map(withGuideVisualDefaults),
    expiresAt: now + CMS_EDITABLE_GUIDES_TTL_MS,
  };

  return fallbackGuides.map(withGuideVisualDefaults);
}
