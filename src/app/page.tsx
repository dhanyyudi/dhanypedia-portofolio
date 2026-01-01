'use client';

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import ProjectOverlay from "@/components/ProjectOverlay";
import type { Project } from "@/types";
import './leaflet-custom.css';

// Dynamic imports
const Globe = dynamic(() => import("@/components/Globe"), { ssr: false });
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [show2DMap, setShow2DMap] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  
  // Transition lock to prevent immediate re-trigger when returning from 2D
  const isTransitioningRef = useRef(false);

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

  // Handle project selection (Click from List or Marker)
  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
    setMapCenter({ lat: project.location.latitude, lng: project.location.longitude });
    
    // Delay for fly-to effect
    setTimeout(() => {
        setShow2DMap(true);
    }, 1200);
  };

  // Handle Manual Zoom In from Globe (only for manual user zoom, not project clicks)
  const handleManualZoomIn = (center: { lat: number, lng: number }) => {
    // Block zoom-in during transition
    if (isTransitioningRef.current) {
      return;
    }
    
    // Only trigger if we're not already showing 2D AND no project is being viewed
    // This prevents clearing activeProject when user clicks a project from the list
    if (!show2DMap && !activeProject) {
        setMapCenter(center);
        setShow2DMap(true);
    }
  };

  const handleCloseProject = () => {
    // Set transition lock to prevent immediate re-trigger
    isTransitioningRef.current = true;
    
    // Set all states immediately
    setShow2DMap(false);
    setActiveProject(null);
    setMapCenter(null);
    
    // Release lock after transition completes
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 2500); // Wait for Globe's camera fly-out animation to complete
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[var(--background-primary)]">
      {/* Navigation */}
      <Navigation />

      {/* Main 3D View */}
      <section className={`absolute inset-0 z-0 bg-blue-900/20 transition-opacity duration-1000 ${show2DMap ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Globe 
          projects={projects} 
          activeProject={activeProject}
          onProjectClick={handleProjectSelect}
          onZoomIn={handleManualZoomIn}
          is2DVisible={show2DMap}
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-[var(--background-primary)] opacity-50" />

        {/* Interactive Hint Overlay - Hidden on mobile (bottom sheet takes that space) */}
        {!show2DMap && !activeProject && (
          <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="glass-card px-6 py-3 text-center animate-pulse-slow">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--accent-primary)]">🖱️ Drag</span> to rotate • <span className="text-[var(--accent-primary)]">🔍 Scroll</span> to zoom • <span className="text-[var(--accent-primary)]">👆 Click</span> markers to view projects
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 2D Map View Transition */}
      <section className={`absolute inset-0 z-[5] transition-opacity duration-1000 ${show2DMap ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         {show2DMap && (
             <MapView 
                projects={projects}
                activeProject={activeProject} 
                initialCenter={mapCenter}
                onClose={handleCloseProject}
                onProjectClick={handleProjectSelect}
             />
         )}
      </section>

      {/* Project Overlay UI */}
      <ProjectOverlay
        projects={projects}
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onClose={handleCloseProject}
      />
    </main>
  );
}

