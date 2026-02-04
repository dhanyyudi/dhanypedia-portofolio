'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Resume } from '@/types/resume';
import { CVEditorWizard } from './components/cv-editor-wizard';

export default function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/cv/${id}`);
        
        if (!response.ok) {
          toast.error('Resume not found');
          router.push('/dashboard/cv');
          return;
        }

        const data = await response.json();
        setResume(data as Resume);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch resume:', error);
        toast.error('Failed to load resume');
        router.push('/dashboard/cv');
      }
    };

    fetchResume();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-muted)]">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Resume not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-primary)] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard/cv')}
            className="p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Resume</h1>
            <p className="text-[var(--text-muted)] text-sm">{resume.title}</p>
          </div>
        </div>

        {/* Wizard */}
        <CVEditorWizard
          resumeId={resume.id}
          initialData={resume.content}
          initialIsPublic={resume.is_public}
          slug={resume.slug}
          title={resume.title}
        />
      </div>
    </main>
  );
}
