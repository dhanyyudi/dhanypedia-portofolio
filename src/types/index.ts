// Project related types
export interface ProjectLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: ProjectLocation;
  year: number;
  media: ProjectMedia[];
  tech_stack: string[];
  impacts: string[];
  external_link?: string;
  category?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// About page types
export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface About {
  id: string;
  name: string;
  title: string;
  photo?: string;
  summary: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  social_links: SocialLink[];
  updated_at: string;
}

// Admin user type
export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

// Form types for admin panel
export interface ProjectFormData {
  title: string;
  description: string;
  location_name: string;
  latitude: number;
  longitude: number;
  year: number;
  media: ProjectMedia[];
  tech_stack: string[];
  impacts: string[];
  external_link?: string;
  category?: string;
  is_visible: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Globe marker types
export interface GlobeMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  size: number;
  color: string;
  project?: Project;
}

export interface ClusterMarker {
  lat: number;
  lng: number;
  count: number;
  projects: Project[];
}
