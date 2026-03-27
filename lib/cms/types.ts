export type GuideLevel = "Principiante" | "Intermedio" | "Avanzado";

export type GuideStatus = "draft" | "published";

export type GuidePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  category: string;
  level: GuideLevel;
  cover_icon: string;
  cover_gradient: string;
  seo_title: string;
  seo_description: string;
  canonical_url: string | null;
  og_image_url: string | null;
  tags: string[];
  author_name: string;
  author_role: string | null;
  reading_minutes: number;
  chapters: number;
  featured: boolean;
  status: GuideStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GuidePostUpsertInput = {
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  category: string;
  level: GuideLevel;
  cover_icon: string;
  cover_gradient: string;
  seo_title: string;
  seo_description: string;
  canonical_url?: string | null;
  og_image_url?: string | null;
  tags?: string[];
  author_name: string;
  author_role?: string | null;
  reading_minutes: number;
  chapters: number;
  featured?: boolean;
  status: GuideStatus;
  published_at?: string | null;
};
