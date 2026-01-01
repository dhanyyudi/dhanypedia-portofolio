'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Globe2,
  Github,
  Linkedin,
  Twitter,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { getSession, uploadImage } from '@/lib/supabase';

interface SkillGroup {
  category: string;
  items: string[];
}

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export default function EditAboutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [photo, setPhoto] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Skill Input State
  const [editingSkill, setEditingSkill] = useState<{ categoryIndex: number, text: string } | null>(null);

  useEffect(() => {
    const init = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setName(data.name || '');
            setTitle(data.title || '');
            setSummary(data.summary || '');
            setPhoto(data.photo_url || data.photo || '');
            setCvUrl(data.cv_url || '');
            setSkills(data.skills || []);
            setExperience(data.experience || []);
            setEducation(data.education || []);
            setSocialLinks(data.social_links || []);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
      
      setIsLoading(false);
    };

    init();
  }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadImage(file, 'portofolio_assets'); // Using generic assets bucket
      setPhoto(url);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCV(true);
    try {
      const url = await uploadImage(file, 'portofolio_assets');
      setCvUrl(url);
      toast.success('CV uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload CV');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title,
          summary,
          photo_url: photo,
          cv_url: cvUrl,
          skills,
          experience,
          education,
          social_links: socialLinks,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions
  const addSkillGroup = () => setSkills([...skills, { category: 'New Category', items: [] }]);
  const addExperience = () => setExperience([...experience, { role: '', company: '', period: '', description: '' }]);
  const addEducation = () => setEducation([...education, { degree: '', institution: '', year: '' }]);
  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: 'twitter', url: '', icon: 'twitter' }]);

  const handleSkillAdd = (categoryIndex: number, skillName: string) => {
    if (!skillName.trim()) return;
    const updated = [...skills];
    updated[categoryIndex].items.push(skillName.trim());
    setSkills(updated);
    setEditingSkill(null);
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
      <header className="sticky top-0 z-50 glass-card border-0 border-b border-[var(--border-color)] rounded-none">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Edit About Me</h1>
              <p className="text-sm text-[var(--text-muted)]">Update your profile information</p>
            </div>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="btn-glow py-2 px-4 text-sm">
            {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Basic Info */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <User size={20} className="text-[var(--accent-primary)]" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="label">Professional Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="label">Profile Photo</label>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-full border border-[var(--border-color)] overflow-hidden bg-black/20 flex items-center justify-center">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-[var(--text-muted)]" />
                  )}
                </div>
                <div>
                   <label className="btn-secondary py-2 px-4 text-sm cursor-pointer inline-flex items-center gap-2">
                     {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                     <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                   </label>
                   <p className="text-xs text-[var(--text-muted)] mt-2">Recommended: Square image, 400x400px.</p>
                </div>
              </div>
            </div>

            {/* CV Upload */}
            <div>
               <label className="label">Resume / CV (PDF)</label>
               <div className="flex gap-3 items-center">
                  <label className="btn-secondary py-2 px-4 text-sm cursor-pointer min-w-[120px] text-center">
                     {uploadingCV ? 'Uploading...' : 'Upload PDF'}
                     <input type="file" accept="application/pdf" className="hidden" onChange={handleCVUpload} disabled={uploadingCV} />
                  </label>
                  {cvUrl && <span className="text-xs text-green-500 flex items-center gap-1">✅ File Uploaded</span>}
               </div>
               <p className="text-xs text-[var(--text-muted)] mt-2">
                  Used for the "Download CV" button.
               </p>
            </div>

            <div className="md:col-span-2">
              <label className="label">Summary / Bio</label>
              <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="input-field min-h-[150px]" />
            </div>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Code2 size={20} className="text-[var(--accent-primary)]" /> Skills & Expertise</h2>
            <button onClick={addSkillGroup} className="btn-secondary py-1 px-3 text-sm"><Plus size={14} /> Add Category</button>
          </div>
          <div className="space-y-6">
            {skills.map((group, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <input type="text" value={group.category} onChange={(e) => {
                    const updated = [...skills];
                    updated[index].category = e.target.value;
                    setSkills(updated);
                  }} className="input-field flex-1" placeholder="Category Name" />
                  <button onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {group.items.map((skill, skillIndex) => (
                    <span key={skillIndex} className="tag flex items-center gap-1">
                      {skill}
                      <button onClick={() => {
                        const updated = [...skills];
                        updated[index].items = updated[index].items.filter((_, i) => i !== skillIndex);
                        setSkills(updated);
                      }} className="hover:text-red-500 ml-1">×</button>
                    </span>
                  ))}
                  
                  {/* Modern Skill Input */}
                  {editingSkill?.categoryIndex === index ? (
                     <div className="flex items-center gap-1">
                        <input 
                           autoFocus
                           type="text" 
                           className="bg-black/40 border border-[var(--accent-primary)] rounded px-2 py-1 text-xs text-white outline-none w-32"
                           placeholder="Type & Enter"
                           onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSkillAdd(index, e.currentTarget.value);
                              if (e.key === 'Escape') setEditingSkill(null);
                           }}
                           onBlur={() => setEditingSkill(null)}
                        />
                     </div>
                  ) : (
                    <button onClick={() => setEditingSkill({ categoryIndex: index, text: '' })} className="px-3 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-full text-xs hover:bg-[var(--accent-primary)]/20 transition-colors">
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Experience & Education sections preserved but simplified in this replacement for brevity, assume similar structure logic is kept but using state correctly */}
        {/* Experience */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Briefcase size={20} className="text-[var(--accent-primary)]" /> Work Experience</h2>
            <button onClick={addExperience} className="btn-secondary py-1 px-3 text-sm"><Plus size={14} /> Add Experience</button>
           </div>
           <div className="space-y-6">
             {experience.map((exp, index) => (
               <div key={index} className="p-4 bg-black/20 rounded-lg relative group">
                  <button onClick={() => setExperience(experience.filter((_, i) => i !== index))} className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                     <input type="text" value={exp.role} onChange={(e) => {const u=[...experience];u[index].role=e.target.value;setExperience(u)}} className="input-field" placeholder="Job Title" />
                     <input type="text" value={exp.company} onChange={(e) => {const u=[...experience];u[index].company=e.target.value;setExperience(u)}} className="input-field" placeholder="Company" />
                     <input type="text" value={exp.period} onChange={(e) => {const u=[...experience];u[index].period=e.target.value;setExperience(u)}} className="input-field md:col-span-2" placeholder="Period (e.g. 2022 - Present)" />
                     <textarea value={exp.description} onChange={(e) => {const u=[...experience];u[index].description=e.target.value;setExperience(u)}} className="input-field md:col-span-2" placeholder="Description" rows={3} />
                  </div>
               </div>
             ))}
           </div>
        </motion.section>

        {/* Education */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><GraduationCap size={20} className="text-[var(--accent-primary)]" /> Education</h2>
            <button onClick={addEducation} className="btn-secondary py-1 px-3 text-sm"><Plus size={14} /> Add Education</button>
           </div>
           <div className="space-y-4">
             {education.map((edu, index) => (
               <div key={index} className="p-4 bg-black/20 rounded-lg flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                     <input type="text" value={edu.degree} onChange={(e) => {const u=[...education];u[index].degree=e.target.value;setEducation(u)}} className="input-field" placeholder="Degree" />
                     <input type="text" value={edu.institution} onChange={(e) => {const u=[...education];u[index].institution=e.target.value;setEducation(u)}} className="input-field" placeholder="Institution" />
                     <input type="text" value={edu.year} onChange={(e) => {const u=[...education];u[index].year=e.target.value;setEducation(u)}} className="input-field" placeholder="Year" />
                  </div>
                  <button onClick={() => setEducation(education.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
               </div>
             ))}
           </div>
        </motion.section>

        {/* Social Links */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Globe2 size={20} className="text-[var(--accent-primary)]" /> Social Links</h2>
            <button onClick={addSocialLink} className="btn-secondary py-1 px-3 text-sm"><Plus size={14} /> Add Link</button>
           </div>
           <div className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg flex gap-4 items-center">
                
                {/* Platform Select */}
                <div className="w-40 flex-shrink-0">
                  <select
                    value={link.platform}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[index].platform = e.target.value;
                      updated[index].icon = e.target.value;
                      setSocialLinks(updated);
                    }}
                    className="input-field cursor-pointer"
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="mail">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* URL Input */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[index].url = e.target.value;
                      setSocialLinks(updated);
                    }}
                    className="input-field w-full"
                    placeholder="https://example.com/profile"
                  />
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg flex-shrink-0 transition-colors"
                  title="Remove Link"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
