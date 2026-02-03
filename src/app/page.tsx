'use client';

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import ProjectOverlay from "@/components/ProjectOverlay";
import ChatWidget from "@/components/ChatWidget";
import type { Project } from "@/types";

// Dynamic import for unified map
const UnifiedMapView = dynamic(() => import("@/components/UnifiedMapView"), { ssr: false });


export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Fetch projects from Supabase API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Simplified event handlers
  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
  };

  const handleCloseProject = () => {
    setActiveProject(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[var(--background-primary)]">
      {/* Navigation */}
      <Navigation />

      {/* Unified Maplibre View (3D Globe + 2D Map) */}
      <UnifiedMapView 
        projects={projects}
        activeProject={activeProject}
        onProjectClick={handleProjectSelect}
      />

      {/* Interactive Hint Overlay */}
      {!activeProject && (
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="glass-card px-6 py-3 text-center animate-pulse-slow">
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--accent-primary)]">🖱️ Drag</span> to rotate • <span className="text-[var(--accent-primary)]">🔍 Scroll</span> to zoom in/out • <span className="text-[var(--accent-primary)]">👆 Click</span> markers to view projects
            </p>
          </div>
        </div>
      )}

      {/* Project Overlay UI */}
      <ProjectOverlay
        projects={projects}
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onClose={handleCloseProject}
      />

      {/* AI Chat Widget */}
      <ChatWidget />
    </main>
  );
}

