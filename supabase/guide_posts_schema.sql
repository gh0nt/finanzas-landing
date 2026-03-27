create extension if not exists pgcrypto;

create table if not exists public.guide_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content_markdown text not null,
  category text not null default 'General',
  level text not null default 'Principiante' check (level in ('Principiante', 'Intermedio', 'Avanzado')),
  cover_icon text not null default 'menu_book',
  cover_gradient text not null default 'linear-gradient(135deg,#1e3a8a,#1d4ed8)',
  seo_title text not null,
  seo_description text not null,
  canonical_url text,
  og_image_url text,
  tags text[] not null default '{}',
  author_name text not null,
  author_role text,
  reading_minutes integer not null default 1 check (reading_minutes > 0),
  chapters integer not null default 1 check (chapters > 0),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_guide_posts_status_published_at
  on public.guide_posts(status, published_at desc);

create index if not exists idx_guide_posts_category
  on public.guide_posts(category);

create index if not exists idx_guide_posts_featured
  on public.guide_posts(featured)
  where featured = true;

create index if not exists idx_guide_posts_tags_gin
  on public.guide_posts using gin(tags);

create or replace function public.set_updated_at_guide_posts()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_guide_posts_updated_at on public.guide_posts;

create trigger trg_guide_posts_updated_at
before update on public.guide_posts
for each row execute procedure public.set_updated_at_guide_posts();

alter table public.guide_posts enable row level security;

drop policy if exists "published guides are readable" on public.guide_posts;
create policy "published guides are readable"
on public.guide_posts
for select
using (status = 'published');

-- Optional policies when using ANON/PUBLISHABLE keys for CMS writes.
-- Keep these only if your app-layer CMS password is your chosen protection.
drop policy if exists "cms anon insert" on public.guide_posts;
create policy "cms anon insert"
on public.guide_posts
for insert
to anon
with check (true);

drop policy if exists "cms anon update" on public.guide_posts;
create policy "cms anon update"
on public.guide_posts
for update
to anon
using (true)
with check (true);

-- Writes are done by this app using SUPABASE_SERVICE_ROLE_KEY from server-side routes.
-- Service role bypasses RLS automatically.
