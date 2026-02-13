-- =============================================
-- Cambodia Career Path - Database Schema
-- =============================================

-- Scholarships table
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_km TEXT NOT NULL,
  provider_en TEXT NOT NULL,
  provider_km TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_km TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('full', 'partial', 'grant')),
  coverage_en TEXT NOT NULL DEFAULT '',
  coverage_km TEXT NOT NULL DEFAULT '',
  eligibility_en TEXT NOT NULL DEFAULT '',
  eligibility_km TEXT NOT NULL DEFAULT '',
  application_url TEXT,
  deadline DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_km TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('public', 'private')),
  location_en TEXT NOT NULL DEFAULT '',
  location_km TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_km TEXT NOT NULL DEFAULT '',
  website TEXT,
  tuition_info_en TEXT,
  tuition_info_km TEXT,
  programs_en TEXT[] NOT NULL DEFAULT '{}',
  programs_km TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vocational Schools table
CREATE TABLE IF NOT EXISTS vocational_schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_km TEXT NOT NULL,
  location_en TEXT NOT NULL DEFAULT '',
  location_km TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_km TEXT NOT NULL DEFAULT '',
  programs_en TEXT[] NOT NULL DEFAULT '{}',
  programs_km TEXT[] NOT NULL DEFAULT '{}',
  website TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scholarship-University relation (many-to-many)
CREATE TABLE IF NOT EXISTS scholarship_university_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(scholarship_id, university_id)
);

-- User Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nickname TEXT NOT NULL DEFAULT '',
  date_of_birth DATE,
  grade TEXT,
  current_province TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  academic_performance TEXT,
  preferred_location TEXT,
  khmer_level TEXT,
  english_level TEXT,
  economic_status TEXT,
  career_status TEXT,
  challenges TEXT,
  dream TEXT,
  privacy_agreed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Visitors table (anonymous login with age & region)
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age INTEGER NOT NULL,
  region TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocational_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_university_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Scholarships: public read
CREATE POLICY "Scholarships are viewable by everyone"
  ON scholarships FOR SELECT
  USING (true);

-- Universities: public read
CREATE POLICY "Universities are viewable by everyone"
  ON universities FOR SELECT
  USING (true);

-- Vocational Schools: public read
CREATE POLICY "Vocational schools are viewable by everyone"
  ON vocational_schools FOR SELECT
  USING (true);

-- Scholarship-University relations: public read
CREATE POLICY "Relations are viewable by everyone"
  ON scholarship_university_relations FOR SELECT
  USING (true);

-- Profiles: users can read and update their own profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Visitors: anyone can insert and read
CREATE POLICY "Anyone can insert visitors"
  ON visitors FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view visitors"
  ON visitors FOR SELECT
  USING (true);

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_scholarships_type ON scholarships(type);
CREATE INDEX IF NOT EXISTS idx_scholarships_is_active ON scholarships(is_active);
CREATE INDEX IF NOT EXISTS idx_universities_type ON universities(type);
CREATE INDEX IF NOT EXISTS idx_scholarship_university_scholarship_id ON scholarship_university_relations(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_university_university_id ON scholarship_university_relations(university_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
