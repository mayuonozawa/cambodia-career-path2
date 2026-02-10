export interface Scholarship {
  id: string;
  name_en: string;
  name_km: string;
  provider_en: string;
  provider_km: string;
  description_en: string;
  description_km: string;
  type: "full" | "partial" | "grant";
  coverage_en: string;
  coverage_km: string;
  eligibility_en: string;
  eligibility_km: string;
  application_url: string | null;
  deadline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name_en: string;
  name_km: string;
  type: "public" | "private";
  location_en: string;
  location_km: string;
  description_en: string;
  description_km: string;
  website: string | null;
  tuition_info_en: string | null;
  tuition_info_km: string | null;
  programs_en: string[];
  programs_km: string[];
  created_at: string;
  updated_at: string;
}

export interface VocationalSchool {
  id: string;
  name_en: string;
  name_km: string;
  location_en: string;
  location_km: string;
  description_en: string;
  description_km: string;
  programs_en: string[];
  programs_km: string[];
  website: string | null;
  contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  nickname: string;
  date_of_birth: string | null;
  grade: string | null;
  current_province: string | null;
  interests: string[];
  academic_performance: string | null;
  preferred_location: string | null;
  khmer_level: string | null;
  english_level: string | null;
  economic_status: string | null;
  career_status: string | null;
  challenges: string | null;
  dream: string | null;
  privacy_agreed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipUniversityRelation {
  id: string;
  scholarship_id: string;
  university_id: string;
  created_at: string;
}

export type Locale = "km" | "en";
