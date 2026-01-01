'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Video,
  MapPin,
  Upload,
  X,
  Search,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getSession, uploadImage } from '@/lib/supabase';
import MediaLibrary from '@/components/MediaLibrary';
import type { ProjectFormData } from '@/types';

// Nominatim result type
interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const isEditing = params.id && params.id !== 'new';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [libraryMediaIndex, setLibraryMediaIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingMediaIndex, setPendingMediaIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      location_name: '',
      latitude: 0,
      longitude: 0,
      year: new Date().getFullYear(),
      media: [],
      tech_stack: [],
      impacts: [],
      external_link: '',
      is_visible: true
    }
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control,
    name: 'media'
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control,
    name: 'tech_stack' as never
  });

  const { fields: impactFields, append: appendImpact, remove: removeImpact } = useFieldArray({
    control,
    name: 'impacts' as never
  });

  useEffect(() => {
    const init = async () => {
      // Check Supabase session
      const session = await getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Load existing project if editing
      if (isEditing) {
        try {
          const response = await fetch(`/api/projects/${params.id}`);
          if (response.ok) {
            const project = await response.json();
            reset({
              title: project.title,
              description: project.description,
              location_name: project.location.name,
              latitude: project.location.latitude,
              longitude: project.location.longitude,
              year: project.year,
              media: project.media,
              tech_stack: project.tech_stack,
              impacts: project.impacts || [],
              external_link: project.external_link || '',
              is_visible: project.is_visible
            });
          }
        } catch (error) {
          console.error('Failed to load project:', error);
        }
      }

      setIsLoading(false);
    };

    init();
  }, [isEditing, params.id, reset, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(prev => new Set(prev).add(index));
    
    try {
      const url = await uploadImage(file, 'projects');
      setValue(`media.${index}.url`, url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImages(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  // Geocoding lookup using OSM Nominatim
  const geocodeLookup = async () => {
    const locationName = watch('location_name');
    if (!locationName || locationName.trim() === '') {
      toast.error('Please enter a location name first');
      return;
    }

    setIsGeocoding(true);
    setLocationResults([]);
    setShowLocationDropdown(false);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=5`,
        {
          headers: {
            'User-Agent': 'DhanypediaPortfolio/1.0'
          }
        }
      );

      if (!response.ok) throw new Error('Geocoding failed');

      const results = await response.json();
      
      if (results && results.length > 0) {
        setLocationResults(results);
        setShowLocationDropdown(true);
        toast.info(`Found ${results.length} location(s). Please select one.`);
      } else {
        toast.error('No locations found. Try a different search term.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to lookup location. Please enter coordinates manually.');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Select a location from the dropdown
  const selectLocation = (result: LocationResult) => {
    setValue('latitude', parseFloat(result.lat));
    setValue('longitude', parseFloat(result.lon));
    setShowLocationDropdown(false);
    setLocationResults([]);
    toast.success('Coordinates filled!');
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    
    try {
      const projectData = {
        title: data.title,
        description: data.description,
        year: data.year,
        location_name: data.location_name,
        location_lat: data.latitude,
        location_lng: data.longitude,
        tech_stack: data.tech_stack.filter(t => t.trim() !== ''),
        external_link: data.external_link || null,
        is_visible: data.is_visible,
        media: data.media.filter(m => m.url.trim() !== '').map(m => ({
          type: m.type,
          url: m.url,
          caption: m.caption || null
        }))
      };

      const url = isEditing ? `/api/projects/${params.id}` : '/api/projects';
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save project');
      }

      router.push('/dashboard');
      toast.success(isEditing ? 'Project updated successfully' : 'Project created successfully');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-0 border-b border-[var(--border-color)] rounded-none">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-lg font-semibold">
            {isEditing ? 'Edit Project' : 'New Project'}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Basic Info */}
          <section className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            
            {/* Title */}
            <div>
              <label className="label">Project Title *</label>
              <input
                type="text"
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="e.g., Urban Land Use Mapping"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="label">Description *</label>
              <textarea
                className={`input-field min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe your project..."
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="label">Year *</label>
              <input
                type="number"
                className={`input-field max-w-xs ${errors.year ? 'border-red-500' : ''}`}
                min="2000"
                max="2030"
                {...register('year', { 
                  required: 'Year is required',
                  min: { value: 2000, message: 'Year must be after 2000' },
                  max: { value: 2030, message: 'Year must be before 2030' }
                })}
              />
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>

            {/* External Link */}
            <div>
              <label className="label">External Link (optional)</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://example.com/project"
                {...register('external_link')}
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_visible"
                className="w-5 h-5 rounded border-[var(--border-color)] bg-[var(--background-secondary)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                {...register('is_visible')}
              />
              <label htmlFor="is_visible" className="text-[var(--text-secondary)]">
                Show this project on the portfolio
              </label>
            </div>
          </section>

          {/* Location */}
          <section className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[var(--accent-primary)]" />
              <h2 className="text-lg font-semibold">Location</h2>
            </div>

            {/* Location Name */}
            <div>
              <label className="label">Location Name *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className={`input-field flex-1 ${errors.location_name ? 'border-red-500' : ''}`}
                  placeholder="e.g., Jakarta, Indonesia"
                  {...register('location_name', { required: 'Location name is required' })}
                />
                <button
                  type="button"
                  onClick={geocodeLookup}
                  disabled={isGeocoding}
                  className="btn-secondary py-2 px-4 flex items-center gap-2"
                  title="Search coordinates from location name"
                >
                  {isGeocoding ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  Lookup
                </button>
              </div>
              {errors.location_name && (
                <p className="text-red-500 text-sm mt-1">{errors.location_name.message}</p>
              )}
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Enter a location name and click "Lookup" to auto-fill coordinates, or enter manually below.
              </p>

              {/* Location Results Dropdown */}
              {showLocationDropdown && locationResults.length > 0 && (
                <div className="mt-2 bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-lg">
                  <div className="px-3 py-2 text-xs text-[var(--text-muted)] bg-black/20 border-b border-[var(--border-color)]">
                    Select a location:
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {locationResults.map((result) => (
                      <button
                        key={result.place_id}
                        type="button"
                        onClick={() => selectLocation(result)}
                        className="w-full text-left px-3 py-2 hover:bg-[var(--accent-primary)]/10 border-b border-[var(--border-color)] last:border-0 transition-colors"
                      >
                        <p className="text-sm text-[var(--text-primary)] line-clamp-2">
                          {result.display_name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLocationDropdown(false)}
                    className="w-full px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-black/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  className={`input-field ${errors.latitude ? 'border-red-500' : ''}`}
                  placeholder="-6.2088"
                  {...register('latitude', { 
                    required: 'Latitude is required',
                    min: { value: -90, message: 'Invalid latitude' },
                    max: { value: 90, message: 'Invalid latitude' }
                  })}
                />
                {errors.latitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
                )}
              </div>
              <div>
                <label className="label">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  className={`input-field ${errors.longitude ? 'border-red-500' : ''}`}
                  placeholder="106.8456"
                  {...register('longitude', { 
                    required: 'Longitude is required',
                    min: { value: -180, message: 'Invalid longitude' },
                    max: { value: 180, message: 'Invalid longitude' }
                  })}
                />
                {errors.longitude && (
                  <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Media</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => appendMedia({ type: 'image', url: '', caption: '' })}
                  className="btn-secondary py-2 px-3 text-sm"
                >
                  <ImageIcon size={14} />
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => appendMedia({ type: 'video', url: '', caption: '' })}
                  className="btn-secondary py-2 px-3 text-sm"
                >
                  <Video size={14} />
                  Add Video URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    appendMedia({ type: 'image', url: '', caption: '' });
                    setLibraryMediaIndex(mediaFields.length);
                    setShowMediaLibrary(true);
                  }}
                  className="btn-glow py-2 px-3 text-sm"
                >
                  <ImageIcon size={14} />
                  Library
                </button>
              </div>
            </div>

            {mediaFields.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-8">
                No media added yet. Add images or video URLs to showcase your project.
              </p>
            ) : (
              <div className="space-y-4">
                {mediaFields.map((field, index) => {
                  const mediaUrl = watch(`media.${index}.url`);
                  return (
                    <div key={field.id} className="flex gap-4 items-start p-4 bg-[var(--background-secondary)] rounded-lg">
                      {/* Preview */}
                      {field.type === 'image' && mediaUrl && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                          {field.type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
                          {field.type === 'image' ? 'Image' : 'Video'}
                        </div>
                        
                        {field.type === 'image' && (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              className="input-field flex-1"
                              placeholder="Image URL or upload below"
                              {...register(`media.${index}.url` as const)}
                            />
                            <label className="btn-secondary py-2 px-3 text-sm cursor-pointer">
                              {uploadingImages.has(index) ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Upload size={14} />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, index)}
                                disabled={uploadingImages.has(index)}
                              />
                            </label>
                          </div>
                        )}
                        
                        {field.type === 'video' && (
                          <input
                            type="url"
                            className="input-field"
                            placeholder="https://youtube.com/watch?v=..."
                            {...register(`media.${index}.url` as const)}
                          />
                        )}
                        
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Caption (optional)"
                          {...register(`media.${index}.caption` as const)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Tech Stack */}
          <section className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tech Stack</h2>
              <button
                type="button"
                onClick={() => appendTech('')}
                className="btn-secondary py-2 px-3 text-sm"
              >
                <Plus size={14} />
                Add Tech
              </button>
            </div>

            {techFields.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-4">
                Add technologies used in this project.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {techFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 bg-[var(--background-secondary)] rounded-lg px-3 py-2">
                    <input
                      type="text"
                      className="bg-transparent border-none outline-none text-sm w-24"
                      placeholder="e.g., Python"
                      {...register(`tech_stack.${index}` as const)}
                    />
                    <button
                      type="button"
                      onClick={() => removeTech(index)}
                      className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Key Impacts */}
          <section className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Key Impacts</h2>
              <button
                type="button"
                onClick={() => appendImpact('')}
                className="btn-secondary py-2 px-3 text-sm"
              >
                <Plus size={14} />
                Add Impact
              </button>
            </div>

            {impactFields.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-4">
                Add key impacts and achievements of this project.
              </p>
            ) : (
              <div className="space-y-3">
                {impactFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-center">
                    <input
                      type="text"
                      className="input-field flex-1"
                      placeholder="e.g., Reduced analysis time by 60%"
                      {...register(`impacts.${index}` as const)}
                    />
                    <button
                      type="button"
                      onClick={() => removeImpact(index)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-glow disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEditing ? 'Update Project' : 'Create Project'}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          // Remove the empty media entry if user cancels
          if (libraryMediaIndex !== null) {
            const currentUrl = watch(`media.${libraryMediaIndex}.url`);
            if (!currentUrl || currentUrl === '') {
              removeMedia(libraryMediaIndex);
            }
          }
          setLibraryMediaIndex(null);
        }}
        onSelect={(url, type) => {
          if (libraryMediaIndex !== null) {
            setValue(`media.${libraryMediaIndex}.url`, url);
            setValue(`media.${libraryMediaIndex}.type`, type);
            toast.success('Media selected from library');
          }
          setLibraryMediaIndex(null);
        }}
        filterType="all"
      />
    </main>
  );
}
