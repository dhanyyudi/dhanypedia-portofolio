/**
 * JSONResume Schema Types
 * Based on https://jsonresume.org/schema/
 */

export interface ResumeBasics {
  name: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles?: Array<{
    network: string;
    username: string;
    url?: string;
  }>;
}

export interface ResumeWork {
  id?: string;
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  description?: string;
  highlights?: string[];
  location?: string;
  isCurrentRole?: boolean;
}

export interface ResumeEducation {
  id?: string;
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
  courses?: string[];
  highlights?: string[];
  location?: string;
}

export interface ResumeSkill {
  name: string;
  level?: string;
  keywords?: string[];
}

export interface ResumeProject {
  name: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
}

export interface ResumeCertificate {
  name: string;
  date?: string;
  issuer?: string;
  url?: string;
}

export interface ResumeLanguage {
  language: string;
  fluency: string;
}

export interface ResumeVolunteer {
  id?: string;
  organization: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  location?: string;
}

export interface JSONResume {
  $schema?: string;
  basics: ResumeBasics;
  work?: ResumeWork[];
  volunteer?: ResumeVolunteer[];
  education?: ResumeEducation[];
  skills?: ResumeSkill[];
  projects?: ResumeProject[];
  certificates?: ResumeCertificate[];
  languages?: ResumeLanguage[];
  meta?: {
    canonical?: string;
    version?: string;
    lastModified?: string;
    source?: string;
  };
}

// Database Resume type (with Supabase fields)
export interface Resume {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: JSONResume;
  is_public: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

// Profile type for CV builder
export interface Profile {
  id: string;
  full_name: string | null;
  headline: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  avatar_url: string | null;
  updated_at: string;
}
