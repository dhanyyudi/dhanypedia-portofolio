import { supabase } from './supabase';

// =====================
// Database Types
// =====================

export interface DbProject {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
  tech_stack: string[] | null;
  external_link: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProjectMedia {
  id: string;
  project_id: string;
  type: 'image' | 'video';
  url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface DbAbout {
  id: string;
  name: string;
  title: string | null;
  summary: string | null;
  photo_url: string | null;
  updated_at: string;
}

export interface DbSkill {
  id: string;
  category: string;
  items: string[];
  display_order: number;
}

export interface DbExperience {
  id: string;
  role: string;
  company: string | null;
  period: string | null;
  description: string | null;
  display_order: number;
}

export interface DbEducation {
  id: string;
  degree: string;
  institution: string | null;
  year: string | null;
  display_order: number;
}

export interface DbSocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
}

// =====================
// Projects Service
// =====================

export const projectsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) throw error;
    return data as DbProject[];
  },

  async getVisible() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('year', { ascending: false });
    
    if (error) throw error;
    return data as DbProject[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as DbProject;
  },

  async create(project: Omit<DbProject, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data as DbProject;
  },

  async update(id: string, project: Partial<DbProject>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as DbProject;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getMedia(projectId: string) {
    const { data, error } = await supabase
      .from('project_media')
      .select('*')
      .eq('project_id', projectId)
      .order('display_order');
    
    if (error) throw error;
    return data as DbProjectMedia[];
  },

  async addMedia(media: Omit<DbProjectMedia, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_media')
      .insert(media)
      .select()
      .single();
    
    if (error) throw error;
    return data as DbProjectMedia;
  },

  async deleteMedia(id: string) {
    const { error } = await supabase
      .from('project_media')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// =====================
// About Service
// =====================

export const aboutService = {
  async get() {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error
    return data as DbAbout | null;
  },

  async upsert(about: Omit<DbAbout, 'id' | 'updated_at'>) {
    // First try to get existing
    const existing = await this.get();
    
    if (existing) {
      const { data, error } = await supabase
        .from('about')
        .update({ ...about, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as DbAbout;
    } else {
      const { data, error } = await supabase
        .from('about')
        .insert(about)
        .select()
        .single();
      
      if (error) throw error;
      return data as DbAbout;
    }
  }
};

// =====================
// Skills Service
// =====================

export const skillsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data as DbSkill[];
  },

  async upsert(skills: Omit<DbSkill, 'id'>[]) {
    // Delete all and re-insert
    await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (skills.length === 0) return [];

    const { data, error } = await supabase
      .from('skills')
      .insert(skills)
      .select();
    
    if (error) throw error;
    return data as DbSkill[];
  }
};

// =====================
// Experience Service
// =====================

export const experienceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data as DbExperience[];
  },

  async upsert(experiences: Omit<DbExperience, 'id'>[]) {
    await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (experiences.length === 0) return [];

    const { data, error } = await supabase
      .from('experience')
      .insert(experiences)
      .select();
    
    if (error) throw error;
    return data as DbExperience[];
  }
};

// =====================
// Education Service
// =====================

export const educationService = {
  async getAll() {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data as DbEducation[];
  },

  async upsert(educations: Omit<DbEducation, 'id'>[]) {
    await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (educations.length === 0) return [];

    const { data, error } = await supabase
      .from('education')
      .insert(educations)
      .select();
    
    if (error) throw error;
    return data as DbEducation[];
  }
};

// =====================
// Social Links Service
// =====================

export const socialLinksService = {
  async getAll() {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data as DbSocialLink[];
  },

  async upsert(links: Omit<DbSocialLink, 'id'>[]) {
    await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (links.length === 0) return [];

    const { data, error } = await supabase
      .from('social_links')
      .insert(links)
      .select();
    
    if (error) throw error;
    return data as DbSocialLink[];
  }
};
