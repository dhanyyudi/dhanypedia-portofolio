'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Layers, ExternalLink, Share2, CheckCircle, X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import Navigation from '@/components/Navigation';
import type { Project } from '@/types';

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${resolvedParams.id}`);
        if (!response.ok) {
          setError('Project not found');
          return;
        }
        const data = await response.json();
        setProject(data);

        // Fetch related projects
        const allProjectsRes = await fetch('/api/projects');
        if (allProjectsRes.ok) {
          const allProjects = await allProjectsRes.json();
          setRelatedProjects(allProjects.filter((p: Project) => p.id !== resolvedParams.id).slice(0, 2));
        }
      } catch (err) {
        setError('Failed to load project');
      }
    };
    fetchProject();
  }, [resolvedParams.id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <Link href="/" className="btn-glow">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-[var(--text-secondary)]">Loading Project...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-primary)] pt-28">
      <Navigation />
      
      {/* Hero Header */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        {project.media[0] && (
          <img 
            src={project.media[0].url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-primary)] via-[var(--background-primary)]/50 to-transparent" />
        
        <div className="absolute top-6 left-6 md:left-12 z-20">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 glass-card px-4 py-2">
            <ArrowLeft size={16} /> Back to Globe
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="glass-card px-3 py-1 text-sm text-[var(--accent-primary)] flex items-center gap-2">
                <MapPin size={14} /> {project.location.name}
              </span>
              <span className="glass-card px-3 py-1 text-sm text-[var(--text-secondary)] flex items-center gap-2">
                <Calendar size={14} /> {project.year}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-[var(--accent-glow)] bg-clip-text text-transparent">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Layers className="text-[var(--accent-primary)]" />
                Project Overview
              </h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Key Impacts */}
            {project.impacts && project.impacts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-500" />
                  Key Impacts
                </h2>
                <ul className="space-y-3">
                  {project.impacts.map((impact, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 mt-2 rounded-full bg-[var(--accent-primary)] shrink-0" />
                      <span className="text-[var(--text-secondary)]">{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gallery */}
            {project.media.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.media.map((m, i) => {
                    const isVideo = m.type === 'video' || m.url.includes('youtube') || m.url.includes('youtu.be');
                    const thumbnailUrl = isVideo ? getYouTubeThumbnail(m.url) : m.url;
                    
                    return (
                      <div 
                        key={i} 
                        className="rounded-xl overflow-hidden h-64 border border-[var(--border-color)] group relative cursor-pointer"
                        onClick={() => setLightboxIndex(i)}
                      >
                        {/* Thumbnail / Image */}
                        <img 
                          src={thumbnailUrl || m.url} 
                          alt={m.caption || project.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm">
                            {isVideo ? <Play size={14} /> : <ZoomIn size={14} />}
                            {isVideo ? 'Play Video' : 'View Image'}
                          </span>
                        </div>

                        {/* Video Indicator (Always visible) */}
                        {isVideo && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:opacity-0 transition-opacity">
                            <Play size={20} className="text-white ml-1" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Technology Stack</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech_stack.map(tech => (
                  <span key={tech} className="tag px-3 py-1.5 text-sm">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                {project.external_link && (
                  <a 
                    href={project.external_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow w-full justify-center"
                  >
                    Visit Live Project <ExternalLink size={16} />
                  </a>
                )}
                
                <button className="btn-secondary w-full justify-center">
                  Share Project <Share2 size={16} />
                </button>
              </div>
            </div>

            {relatedProjects.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">Related Projects</h3>
                <div className="space-y-4">
                  {relatedProjects.map(related => (
                    <Link key={related.id} href={`/projects/${related.id}`} className="block group">
                      <div className="h-32 rounded-lg overflow-hidden mb-2 relative">
                        {related.media[0] && (
                          <img src={related.media[0].url} className="w-full h-full object-cover" alt={related.title} />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                      </div>
                      <h4 className="font-medium group-hover:text-[var(--accent-primary)] transition-colors">{related.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 mt-12 text-center text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} Dhanypedia. Built with passion for GIS.</p>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && project && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full hover:bg-white/10"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={32} />
            </button>

            {/* Prev Button */}
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-3 bg-black/20 rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => 
                  prev !== null ? (prev - 1 + project.media.length) % project.media.length : null
                );
              }}
            >
              <ChevronLeft size={40} />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-3 bg-black/20 rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => 
                  prev !== null ? (prev + 1) % project.media.length : null
                );
              }}
            >
              <ChevronRight size={40} />
            </button>

            {/* Image or Video */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[80vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const currentMedia = project.media[lightboxIndex];
                const isVideo = currentMedia.type === 'video' || currentMedia.url.includes('youtube') || currentMedia.url.includes('youtu.be');
                const videoId = isVideo ? getYouTubeId(currentMedia.url) : null;

                if (isVideo && videoId) {
                  return (
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={currentMedia.caption || 'Project Video'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }

                return (
                  <img
                    src={currentMedia.url}
                    alt={currentMedia.caption || ''}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl bg-black"
                  />
                );
              })()}

              {project.media[lightboxIndex].caption && (
                <div className="mt-4 text-center">
                  <p className="inline-block bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                    {project.media[lightboxIndex].caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
