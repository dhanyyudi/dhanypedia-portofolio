import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (for admin operations)
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

// =====================
// Auth Helper Functions
// =====================

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get current session
 */
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

/**
 * Get current user
 */
export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (event: string, session: unknown) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// =====================
// Storage Helper Functions
// =====================

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param folder - Folder path (e.g., 'projects', 'about')
 * @returns Public URL of the uploaded image
 */
export const uploadImage = async (file: File, folder: string = 'projects'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('portfolio-media')
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export const deleteImage = async (url: string): Promise<void> => {
  // Extract path from URL
  const path = url.split('/portfolio-media/')[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from('portfolio-media')
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 * @param files - Array of files to upload
 * @param folder - Folder path
 * @returns Array of public URLs
 */
export const uploadMultipleImages = async (files: File[], folder: string = 'projects'): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
};
