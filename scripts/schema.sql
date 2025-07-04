-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.attendance_records;
DROP TABLE IF EXISTS public.performance_records;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.teams;

-- Create Teams Table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Users Table
-- This table will store public profile data and a reference to the auth user
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'player' CHECK (role IN ('admin', 'manager', 'coach', 'analyst', 'player')),
  team_id UUID REFERENCES public.teams(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Performance Records Table
CREATE TABLE public.performance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  kills INT DEFAULT 0,
  deaths INT DEFAULT 0,
  assists INT DEFAULT 0,
  damage_dealt INT DEFAULT 0,
  placement INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Attendance Records Table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Function to create a user profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new user is created in the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row-Level Security (RLS) for all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can see all teams
CREATE POLICY "Allow all users to see teams" ON public.teams FOR SELECT USING (true);
-- Users can see all user profiles
CREATE POLICY "Allow all users to see profiles" ON public.users FOR SELECT USING (true);
-- Users can only insert/update their own profile
CREATE POLICY "Allow users to manage their own profile" ON public.users FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
-- Authenticated users can manage performance and attendance records (adjust as needed for roles)
CREATE POLICY "Allow authenticated users to manage performance" ON public.performance_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to manage attendance" ON public.attendance_records FOR ALL USING (auth.role() = 'authenticated');

-- Insert a default team
INSERT INTO public.teams (name, description) VALUES ('Raptors Esports', 'The official Raptors Esports team.');
