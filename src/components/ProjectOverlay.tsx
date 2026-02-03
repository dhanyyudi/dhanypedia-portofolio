'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, X, ExternalLink, ChevronUp, List, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types';
import { useState } from 'react';
import OptimizedImage from './OptimizedImage';

interface ProjectOverlayProps {
  projects: Project[];
  activeProject: Project | null;
  onProjectSelect: (project: Project) => void;
  onClose: () => void;
}

export default function ProjectOverlay({
  projects,
  activeProject,
  onProjectSelect,
  onClose
}: ProjectOverlayProps) {
  const visibleProjects = projects
    .filter(p => p.is_visible)
    .sort((a, b) => b.year - a.year);

  const [isListOpen, setIsListOpen] = useState(true);
  const [isMobileListExpanded, setIsMobileListExpanded] = useState(false);

  return (
    <>
      {/* ========== DESKTOP LAYOUT ========== */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-30">
        {/* Sidebar List - Left Side */}
        <div className={`
          absolute left-0 top-16 bottom-0 w-80 lg:w-96 p-4 lg:p-6 z-[40]
          pointer-events-auto transition-transform duration-500 ease-in-out
          ${isListOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col glass-card overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-white/5 dark:bg-black/20">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-[var(--accent-primary)] bg-clip-text text-transparent">
                  Projects / Works
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  {visibleProjects.length} items
                </p>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {visibleProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onProjectSelect(project)}
                  className={`
                    p-4 rounded-xl cursor-pointer transition-all duration-300 border
                    ${activeProject?.id === project.id 
                      ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                      : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold text-sm ${activeProject?.id === project.id ? 'text-[var(--accent-primary)]' : 'text-white'}`}>
                      {project.title}
                    </h3>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-[var(--text-secondary)]">
                      {project.year}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-2">
                    <MapPin size={12} className="text-[var(--accent-secondary)]" />
                    {project.location.name}
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                    {project.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Button (Visible when closed) */}
        {!isListOpen && (
          <button
            onClick={() => setIsListOpen(true)}
            className="absolute left-6 top-20 pointer-events-auto glass-card p-3 hover:bg-[var(--accent-primary)]/20 transition-colors group"
          >
            <ArrowRight size={20} className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Details Card - Right Side */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute right-0 top-0 bottom-0 w-[400px] p-6 pointer-events-auto flex items-center z-[40]"
            >
              <div className="w-full glass-card overflow-hidden flex flex-col max-h-[90vh]">
                {/* Image Header */}
                <div className="relative h-56 shrink-0">
                  {activeProject.media[0] && (
                    <OptimizedImage
                      src={activeProject.media[0].url} 
                      alt={activeProject.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617]" />
                  <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-[var(--accent-primary)] transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--accent-glow)]">
                        {activeProject.title}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-[var(--accent-primary)] mt-1">
                        <MapPin size={14} />
                        {activeProject.location.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeProject.tech_stack.map((tech) => (
                      <span key={tech} className="tag text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                    {activeProject.description}
                  </p>

                  {/* Actions */}
                  <div className="space-y-3 mt-auto">
                    <Link 
                      href={`/projects/${activeProject.id}`}
                      className="w-full btn-glow text-sm justify-center"
                    >
                      View Case Study <ArrowRight size={16} />
                    </Link>
                    {activeProject.external_link && (
                      <a 
                        href={activeProject.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors py-2"
                      >
                        <ExternalLink size={14} /> Visit Project
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========== MOBILE LAYOUT ========== */}
      <div className="md:hidden absolute inset-0 pointer-events-none z-30 flex flex-col">
        
        {/* Mobile Project List - Bottom Section */}
        <div className={`
          absolute left-0 right-0 bottom-0 pointer-events-auto
          transition-all duration-500 ease-in-out z-[40]
          ${isMobileListExpanded ? 'h-[70vh]' : 'h-[180px]'}
        `}>
          <div className="h-full flex flex-col glass-card rounded-t-2xl overflow-hidden">
            {/* Drag Handle & Header */}
            <button 
              onClick={() => setIsMobileListExpanded(!isMobileListExpanded)}
              className="w-full p-3 border-b border-[var(--border-color)] bg-black/30 flex flex-col items-center"
            >
              <div className="w-10 h-1 bg-white/30 rounded-full mb-2" />
              <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-2">
                  <List size={16} className="text-[var(--accent-primary)]" />
                  <span className="font-semibold text-sm">Projects</span>
                  <span className="text-xs text-[var(--text-muted)]">({visibleProjects.length})</span>
                </div>
                <ChevronUp 
                  size={18} 
                  className={`text-[var(--text-muted)] transition-transform duration-300 ${isMobileListExpanded ? 'rotate-180' : ''}`} 
                />
              </div>
            </button>

            {/* Scrollable Project List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {visibleProjects.map((project) => (
                <motion.div
                  key={project.id}
                  onClick={() => {
                    onProjectSelect(project);
                    setIsMobileListExpanded(false);
                  }}
                  className={`
                    p-2.5 rounded-lg cursor-pointer transition-all duration-300 border
                    ${activeProject?.id === project.id 
                      ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]' 
                      : 'bg-white/5 border-transparent'
                    }
                  `}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-xs truncate ${activeProject?.id === project.id ? 'text-[var(--accent-primary)]' : 'text-white'}`}>
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] mt-0.5">
                        <MapPin size={8} />
                        <span className="truncate">{project.location.name}</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-[var(--text-secondary)] shrink-0">
                      {project.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Project Detail - Full Screen Modal */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 pointer-events-auto bg-[var(--background-primary)]"
            >
              <div className="h-full overflow-y-auto">
                {/* Image Header */}
                <div className="relative h-48">
                  {activeProject.media[0] && (
                    <OptimizedImage
                      src={activeProject.media[0].url} 
                      alt={activeProject.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background-primary)]" />
                </div>

                {/* Content */}
                <div className="p-5 -mt-8 relative pb-20">
                  <h2 className="text-xl font-bold mb-2">
                    {activeProject.title}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-[var(--accent-primary)] mb-4">
                    <MapPin size={14} />
                    {activeProject.location.name} • {activeProject.year}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeProject.tech_stack.slice(0, 5).map((tech) => (
                      <span key={tech} className="tag text-xs">
                        {tech}
                      </span>
                    ))}
                    {activeProject.tech_stack.length > 5 && (
                      <span className="tag text-xs">+{activeProject.tech_stack.length - 5}</span>
                    )}
                  </div>

                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                    {activeProject.description}
                  </p>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Link 
                      href={`/projects/${activeProject.id}`}
                      className="w-full btn-glow text-sm justify-center"
                    >
                      View Full Case Study <ArrowRight size={16} />
                    </Link>
                    {activeProject.external_link && (
                      <a 
                        href={activeProject.external_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] py-2"
                      >
                        <ExternalLink size={14} /> Visit Live Project
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Fixed Back Button - Bottom Left */}
              <button 
                onClick={onClose}
                className="fixed bottom-8 left-4 z-[100] flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] rounded-full text-white text-sm font-medium shadow-xl active:scale-95 transition-transform"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
