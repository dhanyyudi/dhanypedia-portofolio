'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { JSONResume } from '@/types/resume';

interface FormData {
  title: string;
  slug: string;
  name: string;
  label: string;
  email: string;
  phone: string;
  summary: string;
  location: string;
}

export default function NewResumePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      slug: '',
      name: '',
      label: '',
      email: '',
      phone: '',
      summary: '',
      location: '',
    },
  });

  const title = watch('title');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const slug = data.slug || generateSlug(data.title);

      // Build JSONResume content
      const content: JSONResume = {
        basics: {
          name: data.name,
          label: data.label,
          email: data.email,
          phone: data.phone,
          summary: data.summary,
          location: data.location ? { city: data.location } : undefined,
        },
        work: [],
        education: [],
        skills: [],
        projects: [],
      };

      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          slug,
          content,
          is_public: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('A resume with this slug already exists');
        } else {
          toast.error(result.error || 'Failed to create resume');
        }
        return;
      }

      toast.success('Resume created!');
      router.push(`/dashboard/cv/${result.id}/edit`);
    } catch (err) {
      toast.error('Failed to create resume');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background-primary)] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard/cv')}
            className="p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">New Resume</h1>
            <p className="text-[var(--text-muted)] text-sm">Create a new ATS-friendly resume</p>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Meta Section */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[var(--accent-primary)]" />
              Resume Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Title *</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Software Engineer CV"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="label">URL Slug</label>
                <input
                  {...register('slug')}
                  className="input-field"
                  placeholder={generateSlug(title) || 'software-engineer'}
                />
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  Public URL: /cv/{watch('slug') || generateSlug(title) || 'your-slug'}
                </p>
              </div>
            </div>
          </div>

          {/* Basics Section */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Dhany Yudi Prasetyo"
                />
              </div>
              <div>
                <label className="label">Job Title / Label</label>
                <input
                  {...register('label')}
                  className="input-field"
                  placeholder="GIS Developer & Geospatial Analyst"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-field"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  {...register('phone')}
                  className="input-field"
                  placeholder="+62 812 xxxx xxxx"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Location</label>
                <input
                  {...register('location')}
                  className="input-field"
                  placeholder="Jakarta, Indonesia"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Summary</label>
                <textarea
                  {...register('summary')}
                  className="input-field min-h-[120px]"
                  placeholder="A brief professional summary..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard/cv')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-glow disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Resume
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
