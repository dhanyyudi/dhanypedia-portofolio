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
  
  // Form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [photo, setPhoto] = useState('');
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const init = async () => {
      // Check Supabase session
      const session = await getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Load about data from API
      try {
        const response = await fetch('/api/about');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setName(data.name || '');
            setTitle(data.title || '');
            setSummary(data.summary || '');
            setPhoto(data.photo_url || '');
          }
        }
        
        // TODO: Load skills, experience, education, social_links from separate APIs
      } catch (error) {
        console.error('Failed to load data:', error);
      }
      
      setIsLoading(false);
    };

    init();
  }, [router]);

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addSkillGroup = () => {
    setSkills([...skills, { category: 'New Category', items: [] }]);
  };

  const addExperience = () => {
    setExperience([...experience, { role: '', company: '', period: '', description: '' }]);
  };

  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: '' }]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-0 border-b border-[var(--border-color)] rounded-none">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Edit About Me</h1>
              <p className="text-sm text-[var(--text-muted)]">Update your profile information</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-glow py-2 px-4 text-sm"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Basic Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <User size={20} className="text-[var(--accent-primary)]" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="label">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="e.g., GIS Developer"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Photo URL</label>
              <input
                type="text"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="input-field"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Will be replaced with Supabase image upload later
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="label">Summary / Bio</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="input-field min-h-[150px]"
                placeholder="Tell visitors about yourself..."
              />
            </div>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 size={20} className="text-[var(--accent-primary)]" />
              Skills & Expertise
            </h2>
            <button onClick={addSkillGroup} className="btn-secondary py-1 px-3 text-sm">
              <Plus size={14} /> Add Category
            </button>
          </div>

          <div className="space-y-6">
            {skills.map((group, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg">
                <div className="flex items-center gap-4 mb-3">
                  <input
                    type="text"
                    value={group.category}
                    onChange={(e) => {
                      const updated = [...skills];
                      updated[index].category = e.target.value;
                      setSkills(updated);
                    }}
                    className="input-field flex-1"
                    placeholder="Category name"
                  />
                  <button
                    onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill, skillIndex) => (
                    <span key={skillIndex} className="tag flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => {
                          const updated = [...skills];
                          updated[index].items = updated[index].items.filter((_, i) => i !== skillIndex);
                          setSkills(updated);
                        }}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newSkill = prompt('Enter skill name:');
                      if (newSkill) {
                        const updated = [...skills];
                        updated[index].items.push(newSkill);
                        setSkills(updated);
                      }
                    }}
                    className="text-xs text-[var(--accent-primary)] hover:underline"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase size={20} className="text-[var(--accent-primary)]" />
              Work Experience
            </h2>
            <button onClick={addExperience} className="btn-secondary py-1 px-3 text-sm">
              <Plus size={14} /> Add Experience
            </button>
          </div>

          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg">
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-[var(--text-muted)]">Experience #{index + 1}</span>
                  <button
                    onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].role = e.target.value;
                      setExperience(updated);
                    }}
                    className="input-field"
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].company = e.target.value;
                      setExperience(updated);
                    }}
                    className="input-field"
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].period = e.target.value;
                      setExperience(updated);
                    }}
                    className="input-field"
                    placeholder="2020 - Present"
                  />
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...experience];
                      updated[index].description = e.target.value;
                      setExperience(updated);
                    }}
                    className="input-field md:col-span-2"
                    placeholder="Brief description of your role..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap size={20} className="text-[var(--accent-primary)]" />
              Education
            </h2>
            <button onClick={addEducation} className="btn-secondary py-1 px-3 text-sm">
              <Plus size={14} /> Add Education
            </button>
          </div>

          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="p-4 bg-black/20 rounded-lg flex items-center gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[index].degree = e.target.value;
                      setEducation(updated);
                    }}
                    className="input-field"
                    placeholder="Degree"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[index].institution = e.target.value;
                      setEducation(updated);
                    }}
                    className="input-field"
                    placeholder="Institution"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[index].year = e.target.value;
                      setEducation(updated);
                    }}
                    className="input-field"
                    placeholder="Year"
                  />
                </div>
                <button
                  onClick={() => setEducation(education.filter((_, i) => i !== index))}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
