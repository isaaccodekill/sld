create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (id uuid primary key default gen_random_uuid());
alter table public.clients add column if not exists first_name text;
alter table public.clients add column if not exists nickname text;
alter table public.clients add column if not exists date_of_birth date;
alter table public.clients add column if not exists parent_name text;
alter table public.clients add column if not exists parent_phone text;
alter table public.clients add column if not exists parent_email text;
alter table public.clients add column if not exists relationship text;
alter table public.clients add column if not exists primary_concern text;
alter table public.clients add column if not exists tags text[] default '{}';
alter table public.clients add column if not exists working_hypothesis text;
alter table public.clients add column if not exists start_date date default current_date;
alter table public.clients add column if not exists internal_notes text;
alter table public.clients add column if not exists status text default 'active';
alter table public.clients add column if not exists created_at timestamptz default now();
alter table public.clients add column if not exists updated_at timestamptz default now();

create table if not exists public.enquiries (id uuid primary key default gen_random_uuid());
alter table public.enquiries add column if not exists source text;
alter table public.enquiries add column if not exists status text default 'new';
alter table public.enquiries add column if not exists payload jsonb default '{}';
alter table public.enquiries add column if not exists promoted_to_client_id uuid;
alter table public.enquiries add column if not exists created_at timestamptz default now();

create table if not exists public.appointments (id uuid primary key default gen_random_uuid());
alter table public.appointments add column if not exists client_id uuid;
alter table public.appointments add column if not exists starts_at timestamptz;
alter table public.appointments add column if not exists duration_minutes integer;
alter table public.appointments add column if not exists session_type text;
alter table public.appointments add column if not exists status public.appointment_status default 'scheduled';
alter table public.appointments add column if not exists private_notes text;
alter table public.appointments add column if not exists recurrence_group_id uuid;
alter table public.appointments add column if not exists created_at timestamptz default now();
alter table public.appointments add column if not exists updated_at timestamptz default now();
create index if not exists appointments_starts_at_idx on public.appointments(starts_at);

create table if not exists public.session_notes (id uuid primary key default gen_random_uuid());
alter table public.session_notes add column if not exists client_id uuid;
alter table public.session_notes add column if not exists appointment_id uuid;
alter table public.session_notes add column if not exists session_date date;
alter table public.session_notes add column if not exists duration_minutes integer;
alter table public.session_notes add column if not exists session_type text;
alter table public.session_notes add column if not exists focus_areas text;
alter table public.session_notes add column if not exists observations text;
alter table public.session_notes add column if not exists techniques text;
alter table public.session_notes add column if not exists engagement smallint;
alter table public.session_notes add column if not exists progress_notes text;
alter table public.session_notes add column if not exists next_steps text;
alter table public.session_notes add column if not exists tag text;
alter table public.session_notes add column if not exists status public.note_status default 'draft';
alter table public.session_notes add column if not exists created_at timestamptz default now();
alter table public.session_notes add column if not exists updated_at timestamptz default now();

create table if not exists public.reports (id uuid primary key default gen_random_uuid());
alter table public.reports add column if not exists client_id uuid;
alter table public.reports add column if not exists window_start date;
alter table public.reports add column if not exists window_end date;
alter table public.reports add column if not exists occasion text;
alter table public.reports add column if not exists title text;
alter table public.reports add column if not exists status public.report_status default 'draft';
alter table public.reports add column if not exists shared_at timestamptz;
alter table public.reports add column if not exists created_at timestamptz default now();
alter table public.reports add column if not exists updated_at timestamptz default now();

create table if not exists public.report_sections (id uuid primary key default gen_random_uuid());
alter table public.report_sections alter column id set default gen_random_uuid();
alter table public.report_sections add column if not exists report_id uuid;
alter table public.report_sections add column if not exists section_key text;
alter table public.report_sections add column if not exists position integer;
alter table public.report_sections add column if not exists content text default '';
create unique index if not exists report_sections_report_key_idx on public.report_sections(report_id, section_key);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

alter table public.admin_users enable row level security;
alter table public.clients enable row level security;
alter table public.enquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.session_notes enable row level security;
alter table public.reports enable row level security;
alter table public.report_sections enable row level security;

grant usage on schema public to authenticated, anon;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.clients to authenticated;
grant select, insert, update, delete on public.enquiries to authenticated;
grant select, insert, update, delete on public.appointments to authenticated;
grant select, insert, update, delete on public.session_notes to authenticated;
grant select, insert, update, delete on public.reports to authenticated;
grant select, insert, update, delete on public.report_sections to authenticated;
-- PostgREST resolves inserts through the table relation even when the client
-- requests no rows back. SELECT is still protected by RLS (there is no anon
-- select policy), so anonymous visitors cannot read enquiries.
grant select, insert on public.enquiries to anon;

drop policy if exists "admin can read allowlist" on public.admin_users;
drop policy if exists fullgrace_allowlist on public.admin_users;
create policy fullgrace_allowlist on public.admin_users for select to authenticated using (user_id = auth.uid());

drop policy if exists "admin full access clients" on public.clients;
drop policy if exists fullgrace_clients on public.clients;
create policy fullgrace_clients on public.clients for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access enquiries" on public.enquiries;
drop policy if exists fullgrace_enquiries on public.enquiries;
create policy fullgrace_enquiries on public.enquiries for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access appointments" on public.appointments;
drop policy if exists fullgrace_appointments on public.appointments;
create policy fullgrace_appointments on public.appointments for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access notes" on public.session_notes;
drop policy if exists fullgrace_notes on public.session_notes;
create policy fullgrace_notes on public.session_notes for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access reports" on public.reports;
drop policy if exists fullgrace_reports on public.reports;
create policy fullgrace_reports on public.reports for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access report sections" on public.report_sections;
drop policy if exists fullgrace_report_sections on public.report_sections;
create policy fullgrace_report_sections on public.report_sections for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can submit enquiries" on public.enquiries;
drop policy if exists public_submit_enquiries on public.enquiries;
create policy public_submit_enquiries on public.enquiries for insert to anon with check (
  source in ('form_quick', 'form_parent', 'form_referrer', 'widget') and status = 'new'
);

insert into public.admin_users (user_id, email)
select id, lower(email) from auth.users where lower(email) = 'awelebello@gmail.com'
on conflict (user_id) do update set email = excluded.email;
