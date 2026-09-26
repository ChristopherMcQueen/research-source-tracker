-- Research Source Tracker database setup
-- Run this entire file in the Supabase SQL Editor for a new project.

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  url text not null check (char_length(trim(url)) between 1 and 2000),
  source_type text not null default 'News'
    check (source_type in ('News', 'Government', 'Blog', 'Other')),
  comments_status text not null default 'Unknown'
    check (comments_status in ('Available', 'Unavailable', 'Unknown')),
  collection_status text not null default 'Not Started'
    check (collection_status in ('Not Started', 'In Progress', 'Complete')),
  notes text not null default '' check (char_length(notes) <= 3000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sources_user_id_idx on public.sources(user_id);
create index if not exists sources_user_updated_idx
  on public.sources(user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sources_set_updated_at on public.sources;
create trigger sources_set_updated_at
before update on public.sources
for each row execute function public.set_updated_at();

alter table public.sources enable row level security;

drop policy if exists "Users can view their own sources" on public.sources;
create policy "Users can view their own sources"
on public.sources for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own sources" on public.sources;
create policy "Users can create their own sources"
on public.sources for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own sources" on public.sources;
create policy "Users can update their own sources"
on public.sources for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own sources" on public.sources;
create policy "Users can delete their own sources"
on public.sources for delete
to authenticated
using ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.sources to authenticated;
