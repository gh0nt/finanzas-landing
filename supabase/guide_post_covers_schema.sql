-- CMS cover images linked to guide posts (bucket: posts-cms)
-- Run after guide_posts_schema.sql

create table if not exists public.guide_post_covers (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null unique references public.guide_posts(id) on delete cascade,
  bucket_name text not null default 'posts-cms' check (bucket_name = 'posts-cms'),
  object_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_guide_post_covers_post_id
  on public.guide_post_covers(post_id);

create index if not exists idx_guide_post_covers_object_path
  on public.guide_post_covers(object_path);

create trigger trigger_guide_post_covers_set_updated_at
before update on public.guide_post_covers
for each row
execute function public.set_updated_at();

alter table public.guide_post_covers enable row level security;

-- Public can read cover metadata only when post is published
create policy "public_can_read_published_cover_metadata"
on public.guide_post_covers
for select
using (
  exists (
    select 1
    from public.guide_posts gp
    where gp.id = guide_post_covers.post_id
      and gp.status = 'published'
  )
);

-- CMS editor policies (align with your auth model)
create policy "anon_can_insert_cover_metadata"
on public.guide_post_covers
for insert
with check (true);

create policy "anon_can_update_cover_metadata"
on public.guide_post_covers
for update
using (true)
with check (true);

create policy "anon_can_delete_cover_metadata"
on public.guide_post_covers
for delete
using (true);

-- Optional helper view for public rendering
create or replace view public.guide_posts_with_cover as
select
  gp.id,
  gp.slug,
  gp.title,
  gp.excerpt,
  gp.content_markdown,
  gp.category,
  gp.level,
  gp.published_at,
  gp.reading_minutes,
  gp.author_name,
  gp.author_role,
  gp.cover_icon,
  gp.cover_gradient,
  gp.seo_title,
  gp.seo_description,
  gp.canonical_url,
  gp.og_image_url,
  gp.tags,
  gp.status,
  gp.created_at,
  gp.updated_at,
  gpc.object_path as cover_object_path,
  gpc.file_name as cover_file_name,
  gpc.mime_type as cover_mime_type,
  gpc.size_bytes as cover_size_bytes,
  gpc.alt_text as cover_alt_text
from public.guide_posts gp
left join public.guide_post_covers gpc on gpc.post_id = gp.id;

-- Storage bucket policies for posts-cms
-- Ensure the bucket exists in Supabase Storage as private/public per your preference.
create policy "public_can_read_posts_cms_objects"
on storage.objects
for select
using (bucket_id = 'posts-cms');

create policy "anon_can_upload_posts_cms_objects"
on storage.objects
for insert
with check (bucket_id = 'posts-cms');

create policy "anon_can_update_posts_cms_objects"
on storage.objects
for update
using (bucket_id = 'posts-cms')
with check (bucket_id = 'posts-cms');

create policy "anon_can_delete_posts_cms_objects"
on storage.objects
for delete
using (bucket_id = 'posts-cms');
