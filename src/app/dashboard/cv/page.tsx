'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Download,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import type { Resume } from '@/types/resume';

export default function CVListPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        setResumes(data as Resume[]);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
    setIsLoading(false);
  };

  const toggleVisibility = async (resume: Resume) => {
    try {
      const response = await fetch(`/api/cv/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: !resume.is_public }),
      });

      if (response.ok) {
        setResumes(prev =>
          prev.map(r =>
            r.id === resume.id ? { ...r, is_public: !r.is_public } : r
          )
        );
        toast.success(resume.is_public ? 'Resume is now private' : 'Resume is now public');
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/cv/${resumeToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResumes(prev => prev.filter(r => r.id !== resumeToDelete.id));
        setShowDeleteModal(false);
        setResumeToDelete(null);
        toast.success('Resume deleted');
      } else {
        toast.error('Failed to delete resume');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resume');
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-primary)] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">CV Builder</h1>
              <p className="text-[var(--text-muted)] text-sm">Manage your ATS-friendly resumes</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/cv/new')}
            className="btn-glow py-2 px-4 text-sm"
          >
            <Plus size={16} />
            New Resume
          </button>
        </div>

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <FileText size={48} className="text-[var(--text-muted)] mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No Resumes Yet</h2>
            <p className="text-[var(--text-muted)] mb-6">
              Create your first ATS-friendly resume to get started.
            </p>
            <button
              onClick={() => router.push('/dashboard/cv/new')}
              className="btn-glow"
            >
              <Plus size={16} />
              Create Resume
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[var(--accent-primary)]/10">
                    <FileText size={24} className="text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{resume.title}</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      /{resume.slug} • Updated {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Visibility Toggle */}
                  <button
                    onClick={() => toggleVisibility(resume)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      resume.is_public
                        ? 'bg-[var(--accent-glow)]/10 text-[var(--accent-glow)]'
                        : 'bg-[var(--text-muted)]/10 text-[var(--text-muted)]'
                    }`}
                  >
                    {resume.is_public ? <Eye size={14} /> : <EyeOff size={14} />}
                    {resume.is_public ? 'Public' : 'Private'}
                  </button>

                  {/* View Public Link */}
                  {resume.is_public && (
                    <a
                      href={`/cv/${resume.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* Download PDF */}
                  <a
                    href={`/api/cv/${resume.id}/pdf`}
                    className="p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    <Download size={16} />
                  </a>

                  {/* Edit */}
                  <button
                    onClick={() => router.push(`/dashboard/cv/${resume.id}/edit`)}
                    className="p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    <Edit size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteClick(resume)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && resumeToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Delete Resume?</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete &quot;{resumeToDelete.title}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary py-2 px-4"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
