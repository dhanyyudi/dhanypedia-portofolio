'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Globe2, 
  LogOut, 
  FolderOpen, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  MapPin,
  FileText
} from 'lucide-react';
import { getSession, signOut } from '@/lib/supabase';
import Tooltip from '@/components/Tooltip';
import type { Project } from '@/types';

interface AboutData {
  name: string;
  title: string;
  summary: string;
  photo_url: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data function
  const fetchData = async () => {
    try {
      const [projectsRes, aboutRes] = await Promise.all([
        fetch('/api/projects', { cache: 'no-store' }),
        fetch('/api/about', { cache: 'no-store' })
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data);
      }

      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        setAbout(aboutData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Check Supabase session
      const session = await getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      await fetchData();
      setIsLoading(false);
    };

    init();

    // Refetch data when page becomes visible (e.g., navigating back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isLoading) {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refetch on focus (for tab switches)
    window.addEventListener('focus', fetchData);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchData);
    };
  }, [router, isLoading]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const toggleVisibility = async (projectId: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentVisibility }),
      });

      if (response.ok) {
        setProjects(prev =>
          prev.map(p =>
            p.id === projectId ? { ...p, is_visible: !currentVisibility } : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to update visibility:', error);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
        setShowDeleteModal(false);
        setProjectToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-[var(--text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-0 border-b border-[var(--border-color)] rounded-none">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe2 size={28} className="text-[var(--accent-primary)]" />
            <span className="text-xl font-bold">Portfolio Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary py-2 px-4 text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--accent-primary)]/10">
                <FolderOpen size={24} className="text-[var(--accent-primary)]" />
              </div>
              <div>
                <p className="text-[var(--text-muted)] text-sm">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--accent-glow)]/10">
                <Eye size={24} className="text-[var(--accent-glow)]" />
              </div>
              <div>
                <p className="text-[var(--text-muted)] text-sm">Visible</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.is_visible).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--accent-secondary)]/10">
                <MapPin size={24} className="text-[var(--accent-secondary)]" />
              </div>
              <div>
                <p className="text-[var(--text-muted)] text-sm">Countries</p>
                <p className="text-2xl font-bold">
                  {new Set(projects.map(p => p.location.name.split(', ').pop())).size}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CV Builder Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-8 cursor-pointer hover:border-[var(--accent-primary)] transition-colors"
          onClick={() => router.push('/dashboard/cv')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20">
                <FileText size={24} className="text-[var(--accent-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">CV Builder</h3>
                <p className="text-[var(--text-muted)] text-sm">Create ATS-friendly resumes tailored to job applications</p>
              </div>
            </div>
            <button className="btn-glow py-2 px-4 text-sm">
              <Plus size={16} />
              Manage CVs
            </button>
          </div>
        </motion.div>

        {/* Projects Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Projects</h2>
            <button
              onClick={() => router.push('/dashboard/projects/new')}
              className="btn-glow py-2 px-4 text-sm"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>

          {/* Projects Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Project</th>
                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Location</th>
                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Year</th>
                    <th className="text-left p-4 text-sm font-medium text-[var(--text-muted)]">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-[var(--text-muted)] min-w-[180px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--background-tertiary)] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {project.media[0] && (
                            <img
                              src={project.media[0].url}
                              alt={project.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-[var(--text-primary)]">{project.title}</p>
                            <p className="text-sm text-[var(--text-muted)] line-clamp-1 max-w-xs">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[var(--text-secondary)]">{project.location.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-[var(--text-secondary)]">{project.year}</span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleVisibility(project.id, project.is_visible)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            project.is_visible
                              ? 'bg-[var(--accent-glow)]/10 text-[var(--accent-glow)]'
                              : 'bg-[var(--text-muted)]/10 text-[var(--text-muted)]'
                          }`}
                        >
                          {project.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                          {project.is_visible ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1 flex-nowrap">
                          {/* View on Portfolio */}
                          <Tooltip content="View project on portfolio" position="top">
                            <a
                              href={`/projects/${project.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                            >
                              <Globe2 size={16} />
                            </a>
                          </Tooltip>
                          {/* View External Link (if exists) */}
                          {project.external_link && (
                            <Tooltip content="Open external link" position="top">
                              <a
                                href={project.external_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </Tooltip>
                          )}
                          <Tooltip content="Edit project" position="top">
                            <button
                              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                              className="p-2 rounded-lg hover:bg-[var(--background-secondary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete project" position="top">
                            <button
                              onClick={() => handleDeleteClick(project)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">About Me</h2>
            <button
              onClick={() => router.push('/dashboard/about')}
              className="btn-secondary py-2 px-4 text-sm"
            >
              <Edit size={16} />
              Edit About
            </button>
          </div>

          <div className="glass-card p-6">
            {about ? (
              <div className="flex items-center gap-4 mb-4">
                {about.photo_url && (
                  <img
                    src={about.photo_url}
                    alt={about.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent-primary)]"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">{about.name}</h3>
                  <p className="text-[var(--accent-primary)] text-sm">{about.title}</p>
                </div>
              </div>
            ) : (
              <p className="text-[var(--text-muted)]">No about data configured yet.</p>
            )}
            {about?.summary && (
              <p className="text-[var(--text-secondary)] text-sm line-clamp-3">
                {about.summary}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Delete Project?</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete &quot;{projectToDelete.title}&quot;? This action cannot be undone.
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
