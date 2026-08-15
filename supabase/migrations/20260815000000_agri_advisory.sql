-- Agricultural Advisory Service (কৃষি পরামর্শ সেবা)
-- Tables for crops, diseases, seasons, advisory inquiries and weather cache.

create table if not exists public.crops (
  id serial primary key,
  name text not null,
  english_name text,
  category text not null,
  season text,
  soil_type text,
  fertilizer_notes text,
  irrigation_notes text,
  seed_variety_ref text,
  expected_yield text,
  image_url text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.diseases (
  id serial primary key,
  name text not null,
  crop_id integer references public.crops(id) on delete set null,
  crop_name text,
  category text not null,
  symptoms jsonb not null default '[]',
  cause_type text,
  cause_notes text,
  treatment_text text not null,
  prevention_steps jsonb not null default '[]',
  related_product_ids jsonb not null default '[]',
  image_url text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.seasons (
  id serial primary key,
  name text not null,
  english_name text,
  description text,
  months text,
  sowing_window text,
  transplanting_window text,
  harvest_window text,
  applicable_crops jsonb not null default '[]',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.advisory_inquiries (
  id serial primary key,
  name text not null,
  phone text not null,
  district text,
  crop text,
  question text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.weather_cache (
  id serial primary key,
  district text not null unique,
  fetched_at timestamptz not null default now(),
  payload_json jsonb not null
);

-- RLS: enable but allow anonymous read for public advisory content,
-- writes to advisory_inquiries are allowed; admin tables handled by API service role.
alter table public.crops enable row level security;
alter table public.diseases enable row level security;
alter table public.seasons enable row level security;
alter table public.advisory_inquiries enable row level security;
alter table public.weather_cache enable row level security;

drop policy if exists "crops public read" on public.crops;
create policy "crops public read" on public.crops for select using (true);

drop policy if exists "diseases public read" on public.diseases;
create policy "diseases public read" on public.diseases for select using (true);

drop policy if exists "seasons public read" on public.seasons;
create policy "seasons public read" on public.seasons for select using (true);

drop policy if exists "advisory inquiries public insert" on public.advisory_inquiries;
create policy "advisory inquiries public insert" on public.advisory_inquiries for insert with check (true);

drop policy if exists "weather cache public read" on public.weather_cache;
create policy "weather cache public read" on public.weather_cache for select using (true);

create index if not exists idx_diseases_category on public.diseases(category);
create index if not exists idx_diseases_crop_id on public.diseases(crop_id);
create index if not exists idx_crops_category on public.crops(category);
