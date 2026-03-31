import {
  getSupabaseReadClient,
  getSupabaseWriteClient,
  getSupabaseConfigInfo,
} from "@/lib/cms/supabase";
import type { GuidePost, GuidePostUpsertInput } from "@/lib/cms/types";
import { resolveGuideCoverTheme } from "@/lib/cms/utils";

type CmsDatabaseStatus = {
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

let cmsDbStatusCache: {
  expiresAt: number;
  value: CmsDatabaseStatus;
} | null = null;

let cmsEditableGuidesCache: {
  expiresAt: number;
  value: GuidePost[];
} | null = null;

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
  const supabase = getSupabaseWriteClient();

  if (!supabase) {
    return {
      ok: false,
      error:
        "Faltan variables de escritura de Supabase (SERVICE_ROLE_KEY o ANON/PUBLISHABLE key).",
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

export async function getCmsDatabaseStatus() {
  const now = Date.now();
  if (cmsDbStatusCache && cmsDbStatusCache.expiresAt > now) {
    return cmsDbStatusCache.value;
  }

  const readClient = getSupabaseReadClient();
  const writeClient = getSupabaseWriteClient();
  const config = getSupabaseConfigInfo();

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
      writeEnabled: Boolean(writeClient),
      writeMessage: writeClient
        ? config.hasServiceRoleKey
          ? "Escritura habilitada via SERVICE_ROLE_KEY."
          : "Escritura configurada con llave publica; requiere policies RLS de insert/update en Supabase."
        : "Escritura deshabilitada: faltan llaves de escritura.",
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
    writeEnabled: Boolean(writeClient),
    writeMessage: writeClient
      ? config.hasServiceRoleKey
        ? "Escritura habilitada via SERVICE_ROLE_KEY."
        : "Escritura configurada con llave publica; requiere policies RLS de insert/update en Supabase."
      : "Escritura deshabilitada: faltan llaves de escritura.",
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

  const writeClient = getSupabaseWriteClient();
  const readClient = getSupabaseReadClient();

  if (writeClient) {
    const { data, error } = await writeClient
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
