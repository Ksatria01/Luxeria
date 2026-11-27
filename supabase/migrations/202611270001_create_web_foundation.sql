-- Luxeria Web foundation. This migration does not alter the existing bot tables.
create table if not exists public.web_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.web_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'owner')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists public.web_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.web_support (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.web_activity_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.web_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists web_notifications_user_created_idx on public.web_notifications(user_id, created_at desc);
create index if not exists web_support_user_created_idx on public.web_support(user_id, created_at desc);
create index if not exists web_activity_user_created_idx on public.web_activity_logs(user_id, created_at desc);
create index if not exists web_announcements_published_idx on public.web_announcements(published, published_at desc);

alter table public.web_profiles enable row level security;
alter table public.web_roles enable row level security;
alter table public.web_notifications enable row level security;
alter table public.web_support enable row level security;
alter table public.web_activity_logs enable row level security;
alter table public.web_announcements enable row level security;

-- Users may read and update only their own profile. Role changes are never self-service.
create policy "web_profiles_select_own" on public.web_profiles for select to authenticated using ((select auth.uid()) = id);
create policy "web_profiles_insert_own" on public.web_profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "web_profiles_update_own" on public.web_profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- An admin can read only their own role row for server-side authorization checks.
create policy "web_roles_select_own" on public.web_roles for select to authenticated using ((select auth.uid()) = user_id);

create policy "web_notifications_select_own" on public.web_notifications for select to authenticated using ((select auth.uid()) = user_id);
create policy "web_notifications_update_own" on public.web_notifications for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "web_support_select_own" on public.web_support for select to authenticated using ((select auth.uid()) = user_id);
create policy "web_support_insert_own" on public.web_support for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "web_announcements_read_published" on public.web_announcements for select to authenticated using (published = true);

-- Logs are written by trusted server-side processes only. No client write policy is created.
revoke all on public.web_profiles, public.web_roles, public.web_notifications, public.web_support, public.web_activity_logs, public.web_announcements from anon;
grant select, insert, update on public.web_profiles to authenticated;
grant select on public.web_roles to authenticated;
grant select, update on public.web_notifications to authenticated;
grant select, insert on public.web_support to authenticated;
grant select on public.web_announcements to authenticated;
revoke insert, update, delete on public.web_activity_logs from anon, authenticated;
