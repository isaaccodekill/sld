create extension if not exists pgcrypto;

do $$ begin
  create type public.appointment_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.note_status as enum ('draft', 'final');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.report_status as enum ('draft', 'shared');
exception when duplicate_object then null;
end $$;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  nickname text,
  date_of_birth date,
  parent_name text not null,
  parent_phone text,
  parent_email text,
  relationship text,
  primary_concern text,
  tags text[] not null default '{}',
  working_hypothesis text,
  start_date date not null default current_date,
  internal_notes text,
  status text not null default 'active' check (status in ('active', 'paused', 'discharged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  payload jsonb not null default '{}',
  promoted_to_client_id uuid references public.clients(id),
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id),
  starts_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes between 15 and 240),
  session_type text not null,
  status public.appointment_status not null default 'scheduled',
  private_notes text,
  recurrence_group_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index appointments_starts_at_idx on public.appointments(starts_at);

create table public.session_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id),
  appointment_id uuid references public.appointments(id),
  session_date date not null,
  duration_minutes integer not null,
  session_type text not null,
  focus_areas text,
  observations text,
  techniques text,
  engagement smallint check (engagement between 1 and 5),
  progress_notes text,
  next_steps text,
  tag text,
  status public.note_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id),
  window_start date not null,
  window_end date not null,
  occasion text,
  title text not null,
  status public.report_status not null default 'draft',
  shared_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.report_sections (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  section_key text not null,
  position integer not null,
  content text not null default '',
  unique(report_id, section_key)
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

alter table public.admin_users enable row level security;
alter table public.clients enable row level security;
alter table public.enquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.session_notes enable row level security;
alter table public.reports enable row level security;
alter table public.report_sections enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.enquiries to authenticated;
grant select, insert, update, delete on public.appointments to authenticated;
grant select, insert, update, delete on public.session_notes to authenticated;
grant select, insert, update, delete on public.reports to authenticated;
grant select, insert, update, delete on public.report_sections to authenticated;
grant insert on public.enquiries to anon;

create policy "admin can read allowlist" on public.admin_users for select using (user_id = auth.uid());
create policy "admin full access clients" on public.clients for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access enquiries" on public.enquiries for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access appointments" on public.appointments for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access notes" on public.session_notes for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access reports" on public.reports for all using (public.is_admin()) with check (public.is_admin());
create policy "admin full access report sections" on public.report_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "public can submit enquiries" on public.enquiries for insert to anon with check (
  source in ('form_quick', 'form_parent', 'form_referrer', 'widget')
  and status = 'new'
);

-- After creating the single Auth user, allowlist it once in the SQL editor:
-- insert into public.admin_users (user_id, email)
-- select id, lower(email) from auth.users where lower(email) = lower('therapist@example.com');
