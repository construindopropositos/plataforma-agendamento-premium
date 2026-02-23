-- INIT SCRIPT FOR NEW PROJECT
-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Availability Table
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id),
  guest_email TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_id TEXT,
  price NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Meeting Notes Table
CREATE TABLE IF NOT EXISTS public.meeting_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;

-- Basic Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view availability" ON public.availability;
CREATE POLICY "Anyone can view availability" ON public.availability FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = client_id OR guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Add Trigger for Profiling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
