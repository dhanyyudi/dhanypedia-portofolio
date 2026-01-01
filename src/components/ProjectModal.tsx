'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Play
} from 'lucide-react';
import type { Project } from '@/types';
import { getYouTubeId, isVideoUrl } from '@/lib/utils';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  if (!project) return null;

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === project.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? project.media.length - 1 : prev - 1
    );
  };

  const currentMedia = project.media[currentMediaIndex];

  const renderMedia = () => {
    if (!currentMedia) {
      return (
        <div className="w-full h-64 md:h-80 bg-[var(--background-tertiary)] rounded-lg flex items-center justify-center">
          <span className="text-[var(--text-muted)]">No media available</span>
        </div>
      );
    }

    if (currentMedia.type === 'video' && isVideoUrl(currentMedia.url)) {
      const youtubeId = getYouTubeId(currentMedia.url);
      if (youtubeId) {
        return (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={currentMedia.caption || project.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
      // Vimeo or other video
      return (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-[var(--background-tertiary)] flex items-center justify-center">
          <a 
            href={currentMedia.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
          >
            <Play size={48} />
            <span>Watch Video</span>
          </a>
        </div>
      );
    }

    // Image
    return (
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={currentMedia.url}
          alt={currentMedia.caption || project.title}
          fill
          className="object-cover"
        />
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="glass-card w-full max-w-3xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Media Carousel */}
            <div className="relative">
              {renderMedia()}
              
              {/* Navigation Arrows */}
              {project.media.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Previous media"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="Next media"
                  >
                    <ChevronRight size={24} />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentMediaIndex 
                            ? 'bg-[var(--accent-primary)] w-4' 
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to media ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {/* Title & Location */}
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                {project.title}
              </h2>
              
              <div className="flex flex-wrap gap-4 text-[var(--text-secondary)] mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={16} className="text-[var(--accent-primary)]" />
                  {project.location.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} className="text-[var(--accent-primary)]" />
                  {project.year}
                </span>
              </div>

              {/* Description */}
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, index) => (
                    <span key={index} className="tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Impacts */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider">
                  Key Impacts
                </h3>
                <ul className="space-y-2">
                  {project.impacts.map((impact, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-2 text-[var(--text-secondary)]"
                    >
                      <Zap size={16} className="text-[var(--accent-glow)] mt-0.5 flex-shrink-0" />
                      {impact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* External Link */}
              {project.external_link && (
                <a
                  href={project.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow inline-flex w-full justify-center"
                >
                  <ExternalLink size={18} />
                  View Live Project
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
