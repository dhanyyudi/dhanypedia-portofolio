'use client';

import { useState } from 'react';
import { JSONResume } from '@/types/resume';
import { Camera, X, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface PersonalStepProps {
  data: JSONResume;
  updateData: <K extends keyof JSONResume>(key: K, value: JSONResume[K]) => void;
}

export function PersonalStep({ data, updateData }: PersonalStepProps) {
  const basics = data.basics || { name: '' };
  const [isUploading, setIsUploading] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.replace('location.', '');
      updateData('basics', {
        ...basics,
        location: {
          ...basics.location,
          [locationField]: value,
        },
      });
    } else if (field.startsWith('profiles.linkedin')) {
      const profiles = basics.profiles || [];
      const linkedinIndex = profiles.findIndex(p => p.network === 'LinkedIn');
      if (linkedinIndex >= 0) {
        profiles[linkedinIndex] = { ...profiles[linkedinIndex], url: value };
      } else {
        profiles.push({ network: 'LinkedIn', username: '', url: value });
      }
      updateData('basics', { ...basics, profiles });
    } else {
      updateData('basics', { ...basics, [field]: value });
    }
  };

  const linkedinUrl = basics.profiles?.find(p => p.network === 'LinkedIn')?.url || '';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Dynamically import uploadImage to ensure client-side compatibility if needed, 
      // or just assume the lib is safe. 
      // We will use the existing helper.
      const { uploadImage } = await import('@/lib/supabase');
      const url = await uploadImage(file, 'avatars');
      handleChange('image', url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Personal Information 👤</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Enter your contact details and professional summary.
        </p>
      </div>

      {/* Photo Upload Section */}
      <div className="flex items-start gap-4 pb-4 border-b border-[var(--border-primary)]">
        {/* Photo Preview */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[var(--background-secondary)] border-2 border-[var(--border-primary)] flex items-center justify-center">
            {basics.image ? (
              <Image
                src={basics.image}
                alt="Profile photo"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <Camera className="w-8 h-8 text-[var(--text-muted)]" />
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          {basics.image && (
            <button
              onClick={() => handleChange('image', '')}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Profile Photo
          </label>
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
               <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
                <Camera className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Photo'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
              {showImageInput ? (
                <button
                  onClick={() => setShowImageInput(false)}
                  className="px-3 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
                >
                  Cancel URL
                </button>
              ) : (
                <button
                  onClick={() => setShowImageInput(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[var(--border-primary)] text-sm text-[var(--text-muted)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
                >
                  <LinkIcon className="w-4 h-4" />
                  Use URL
                </button>
              )}
            </div>

            {showImageInput && (
              <input
                type="url"
                value={basics.image || ''}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all text-sm"
              />
            )}
          </div>
          
          <p className="text-xs text-[var(--text-muted)]">
            Recommended: Square JPG or PNG, max 2MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={basics.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Dhany Yudi Prasetyo"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Job Title / Headline
          </label>
          <input
            type="text"
            value={basics.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="GIS & Data Analyst | Cartography Engineer"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={basics.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Phone Number
          </label>
          <input
            type="tel"
            value={basics.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+62 812 3456 7890"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Website / Portfolio
          </label>
          <input
            type="url"
            value={basics.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://www.yourportfolio.com"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => handleChange('profiles.linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            City
          </label>
          <input
            type="text"
            value={basics.location?.city || ''}
            onChange={(e) => handleChange('location.city', e.target.value)}
            placeholder="Jakarta"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>

        {/* Country/Region */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Country / Region
          </label>
          <input
            type="text"
            value={basics.location?.region || ''}
            onChange={(e) => handleChange('location.region', e.target.value)}
            placeholder="Indonesia"
            className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--text-secondary)]">
          Professional Summary
        </label>
        <textarea
          value={basics.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="A brief 2-3 sentence summary of your professional background and key strengths..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all resize-none"
        />
        <p className="text-xs text-[var(--text-muted)]">
          {(basics.summary || '').length}/200 characters recommended
        </p>
      </div>
    </div>
  );
}
