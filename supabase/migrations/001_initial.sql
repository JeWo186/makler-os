-- MaklerOS MVP Schema

create extension if not exists "uuid-ossp";

-- Cities
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  state text not null,
  population integer,
  lat decimal(10, 6),
  lng decimal(10, 6)
);

-- Specializations
create table if not exists specializations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text
);

-- Brokers
create table if not exists brokers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  company text,
  email text,
  phone text,
  photo_url text,
  bio text,
  tier text not null default 'free' check (tier in ('free', 'basic', 'pro', 'premium')),
  verified boolean not null default false,
  city_primary text,
  zip text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Broker <-> City (many-to-many)
create table if not exists broker_cities (
  broker_id uuid not null references brokers(id) on delete cascade,
  city_id uuid not null references cities(id) on delete cascade,
  primary key (broker_id, city_id)
);

-- Broker <-> Specialization (many-to-many)
create table if not exists broker_specializations (
  broker_id uuid not null references brokers(id) on delete cascade,
  specialization_id uuid not null references specializations(id) on delete cascade,
  primary key (broker_id, specialization_id)
);

-- Reviews
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references brokers(id) on delete cascade,
  reviewer_name text not null,
  reviewer_email text,
  rating_overall integer not null check (rating_overall between 1 and 5),
  rating_availability integer not null check (rating_availability between 1 and 5),
  rating_market_knowledge integer not null check (rating_market_knowledge between 1 and 5),
  rating_communication integer not null check (rating_communication between 1 and 5),
  text text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid references brokers(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  message text,
  property_type text check (property_type in ('wohnung', 'haus', 'mfh', 'gewerbe', 'grundstueck')),
  intent text check (intent in ('kaufen', 'verkaufen', 'bewerten', 'mieten')),
  city text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'lost')),
  created_at timestamptz not null default now()
);

-- Valuations (Bewertungsrechner)
create table if not exists valuations (
  id uuid primary key default gen_random_uuid(),
  address text,
  city text,
  zip text,
  property_type text not null check (property_type in ('wohnung', 'haus', 'mfh', 'gewerbe', 'grundstueck')),
  area_sqm decimal(8,2) not null,
  year_built integer,
  condition text check (condition in ('renovierungsbeduerftig', 'normal', 'gut', 'neuwertig')),
  floor integer,
  has_garden boolean not null default false,
  has_parking boolean not null default false,
  estimated_min decimal(12,2),
  estimated_max decimal(12,2),
  lead_email text,
  lead_name text,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_brokers_slug on brokers(slug);
create index if not exists idx_brokers_tier on brokers(tier);
create index if not exists idx_brokers_city_primary on brokers(city_primary);
create index if not exists idx_cities_slug on cities(slug);
create index if not exists idx_specializations_slug on specializations(slug);
create index if not exists idx_reviews_broker_id on reviews(broker_id);
create index if not exists idx_leads_broker_id on leads(broker_id);
create index if not exists idx_leads_status on leads(status);

-- Views
create or replace view broker_with_stats as
select
  b.*,
  coalesce(avg(r.rating_overall), 0)::decimal(3,1) as avg_rating,
  count(r.id) as review_count
from brokers b
left join reviews r on r.broker_id = b.id and r.verified = true
group by b.id;

-- Row Level Security
alter table brokers enable row level security;
alter table reviews enable row level security;
alter table leads enable row level security;
alter table valuations enable row level security;

-- Public read access for brokers, cities, specializations, reviews
create policy "Public read brokers" on brokers for select using (true);
create policy "Public read reviews" on reviews for select using (verified = true);
create policy "Insert leads" on leads for insert with check (true);
create policy "Insert valuations" on valuations for insert with check (true);
