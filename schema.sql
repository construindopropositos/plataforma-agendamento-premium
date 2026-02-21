-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  subscription_status text default 'inactive',
  user_id uuid default auth.uid()
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy for users to see their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy for users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Meeting Notes Table
create table meeting_notes (
  id uuid default gen_random_uuid() primary key,
  session_id text not null,
  user_id uuid references auth.users not null default auth.uid(),
  content text,
  updated_at timestamp with time zone default now()
);

alter table meeting_notes enable row level security;

-- Admin can see all, users see their own
create policy "Users can view own notes"
  on meeting_notes for select
  using ( auth.uid() = user_id );

create policy "Users can insert/update own notes"
  on meeting_notes for all
  using ( auth.uid() = user_id );

-- PHASE 2: SCHEDULING

-- Appointment Status Enum
create type appointment_status as enum ('pending', 'confirmed', 'cancelled');

-- Appointments Table
create table appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status appointment_status default 'pending',
  meet_link text,
  payment_id text,
  created_at timestamptz default now(),
  
  -- Prevenção de conflito de horários (Corrigido para evitar erro de IMMUTABLE)
  constraint no_overlap exclude using gist (
    tstzrange(start_time, end_time) WITH &&
  )
);

alter table appointments enable row level security;

-- Policies for Appointments
create policy "Users can view own appointments"
  on appointments for select
  using ( auth.uid() = user_id );

create policy "Users can insert own appointments"
  on appointments for insert
  with check ( auth.uid() = user_id );

create policy "Admin can view all appointments"
  on appointments for all
  using ( exists (select 1 from profiles where id = auth.uid() and subscription_status = 'admin') );

-- Availability Table (Consultant Rules)
create table availability (
  id uuid default gen_random_uuid() primary key,
  day_of_week int check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time time not null,
  end_time time not null,
  is_active boolean default true
);

alter table availability enable row level security;

-- Public can view availability rules
create policy "Anyone can view availability"
  on availability for select
  to authenticated
  using ( true );

-- Admin can manage availability
create policy "Admin can manage availability"
  on availability for all
  using ( exists (select 1 from profiles where id = auth.uid() and subscription_status = 'admin') );

