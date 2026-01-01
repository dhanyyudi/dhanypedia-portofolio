'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Building2, Trees, Zap, Navigation, Waves, Pickaxe, Globe2, MapPin, AlertTriangle } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import type { Project } from '@/types';

interface GlobeProps {
  projects: Project[];
  activeProject: Project | null;
  onProjectClick: (project: Project) => void;
  onZoomIn?: (center: { lat: number, lng: number }) => void;
  is2DVisible?: boolean;
}

// Check if WebGL is available
const isWebGLAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
};

// Check if running on mobile
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const getProjectIcon = (project: Project) => {
  // Use explicit category if available
  if (project.category) {
    switch (project.category) {
      case 'urban': return <Building2 size={16} />;
      case 'environment': return <Trees size={16} />;
      case 'water': return <Waves size={16} />;
      case 'mining': return <Pickaxe size={16} />;
      case 'transport': return <Navigation size={16} />;
      case 'energy': return <Zap size={16} />;
      case 'other': return <Globe2 size={16} />;
    }
  }

  // Fallback to title matching
  const t = project.title.toLowerCase();
  if (t.includes('urban') || t.includes('city') || t.includes('infrastructure')) return <Building2 size={16} />;
  if (t.includes('forest') || t.includes('agriculture') || t.includes('land')) return <Trees size={16} />;
  if (t.includes('flood') || t.includes('water') || t.includes('coastal')) return <Waves size={16} />;
  if (t.includes('mining') || t.includes('reclamation')) return <Pickaxe size={16} />;
  if (t.includes('transport')) return <Navigation size={16} />;
  return <Zap size={16} />;
};

const GlobeComponent = ({ projects, activeProject, onProjectClick, onZoomIn, is2DVisible }: GlobeProps) => {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Detect mobile immediately (before any useEffect)
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const initGlobe = useCallback(async () => {
    // Skip completely on mobile
    if (isMobile) {
      console.log('Mobile device detected, skipping 3D globe');
      return;
    }
    
    if (!globeRef.current || isInitialized || hasError) return;

    // Check WebGL availability first
    if (!isWebGLAvailable()) {
      console.warn('WebGL not available, showing fallback');
      setHasError(true);
      return;
    }

    try {
      const Globe = (await import('globe.gl')).default;

      // @ts-ignore
      const globe = Globe()(globeRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .showAtmosphere(true)
        .atmosphereColor('#38bdf8')
        .atmosphereAltitude(0.15)
        .width(globeRef.current.clientWidth || window.innerWidth)
        .height(globeRef.current.clientHeight || window.innerHeight);

      console.log('Globe initialized');

      // Custom HTML Markers with Permanent Labels
      globe
        .htmlElementsData(projects.filter(p => p.is_visible))
        .htmlLat((d: any) => d.location.latitude)
        .htmlLng((d: any) => d.location.longitude)
        .htmlElement((d: any) => {
          const project = d as Project;
          const isActive = activeProject?.id === project.id;
          const icon = getProjectIcon(project);
          const color = isActive ? '#38bdf8' : '#ffffff';
          
          const el = document.createElement('div');
          el.style.display = 'flex';
          el.style.flexDirection = 'column';
          el.style.alignItems = 'center';
          el.style.cursor = 'pointer';
          el.style.pointerEvents = 'auto';

          const size = isActive ? '48px' : '36px';

          el.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${size};
              height: ${size};
              background: rgba(15, 23, 42, 0.9);
              border: 2px solid ${color};
              border-radius: 50%;
              color: ${color};
              box-shadow: 0 0 15px rgba(56, 189, 248, ${isActive ? '0.5' : '0.2'});
              transition: all 0.3s ease;
            ">
              ${renderToString(icon)}
            </div>
            <div style="
              max-width: 120px;
              text-align: center;
              font-size: 10px;
              font-weight: 600;
              color: ${color};
              padding: 2px 8px;
              margin-top: 4px;
              background: rgba(15, 23, 42, 0.85);
              border-radius: 4px;
              border: 1px solid rgba(255,255,255,0.1);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              opacity: 1;
              transition: all 0.3s ease;
            ">
              ${project.title}
            </div>
          `;
          
          el.onclick = () => onProjectClick(project);
          el.onmouseenter = () => {
            document.body.style.cursor = 'pointer';
            const badge = el.querySelector('div:first-child') as HTMLElement;
            const label = el.querySelector('div:last-child') as HTMLElement;
            if (badge) badge.style.borderColor = '#38bdf8';
            if (badge) badge.style.transform = 'scale(1.1)';
            if (label) label.style.borderColor = '#38bdf8';
            if (label) label.style.color = '#fff';
          };
          el.onmouseleave = () => {
            document.body.style.cursor = 'default';
            const badge = el.querySelector('div:first-child') as HTMLElement;
            const label = el.querySelector('div:last-child') as HTMLElement;
            if (!isActive && badge) badge.style.borderColor = '#ffffff';
            if (badge) badge.style.transform = 'scale(1)';
            if (!isActive && label) label.style.borderColor = 'rgba(255,255,255,0.1)';
          };
          
          return el;
        });

      globe.arcsData([]);

      // Controls
      globe.controls().autoRotate = false;
      globe.controls().enableZoom = true;
      globe.controls().minDistance = 20;
      globe.controls().maxDistance = 1000;
      globe.controls().enableDamping = true;
      globe.controls().dampingFactor = 0.1;

      // ZOOM LISTENER for "Super HD" Transition
      const controls = globe.controls();
      controls.addEventListener('change', () => {
          const distance = controls.getDistance();
          
          if (distance < 135) {
              const { lat, lng } = globe.pointOfView();
              
              if (onZoomIn) {
                  onZoomIn({ lat, lng });
              }
          }
      });

      // Initial view
      setTimeout(() => {
        globe.pointOfView({ lat: 5, lng: 115, altitude: 2.0 }, 1500);
      }, 500);

      globeInstanceRef.current = globe;
      setIsInitialized(true);

      // Handle resize
      const handleResize = () => {
        if (globeRef.current && globeInstanceRef.current) {
          globeInstanceRef.current
            .width(globeRef.current.clientWidth)
            .height(globeRef.current.clientHeight);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } catch (error) {
      console.error('Globe initialization failed:', error);
      setHasError(true);
    }
  }, [projects, activeProject, onProjectClick, onZoomIn, isInitialized, hasError]);

  useEffect(() => {
    initGlobe();
  }, [initGlobe]);

  // Update markers when active project changes
  useEffect(() => {
    if (globeInstanceRef.current && isInitialized && !is2DVisible) {
      globeInstanceRef.current.htmlElementsData(
        projects.filter(p => p.is_visible)
      );
      
      if (activeProject) {
        globeInstanceRef.current.pointOfView({
          lat: activeProject.location.latitude,
          lng: activeProject.location.longitude,
          altitude: 0.2
        }, 1500);
        
        globeInstanceRef.current.controls().autoRotate = false;
      } else {
        globeInstanceRef.current.controls().autoRotate = false;
      }
    }
  }, [activeProject, projects, isInitialized, is2DVisible]);

  // Fallback view for mobile or WebGL errors
  if (hasError || (isMobile && !isInitialized)) {
    return (
      <div className="globe-container flex flex-col items-center justify-center bg-gradient-to-b from-[#0c1929] to-[#020617]">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Static world map background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url(//unpkg.com/three-globe/example/img/earth-blue-marble.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px)'
            }}
          />
          
          {/* Center content */}
          <div className="relative z-10 text-center p-6">
            <Globe2 size={64} className="text-[var(--accent-primary)] mx-auto mb-4 opacity-70" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Interactive Globe
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4 max-w-xs">
              {isMobile 
                ? "Select a project from the list below to explore"
                : "3D view unavailable. Browse projects from the list."}
            </p>
            
            {/* Quick project markers */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm">
              {projects.filter(p => p.is_visible).slice(0, 4).map((project) => (
                <button
                  key={project.id}
                  onClick={() => onProjectClick(project)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all ${
                    activeProject?.id === project.id
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <MapPin size={10} />
                  {project.location.name.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="globe-container">
      <div ref={globeRef} className="w-full h-full" />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background-primary)] z-10">
          <div className="text-center">
             <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
             <p className="text-[var(--text-secondary)]">Loading World Data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Export with dynamic import
export default dynamic(() => Promise.resolve(GlobeComponent), {
  ssr: false,
  loading: () => (
    <div className="globe-container flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
        <p className="text-[var(--text-secondary)]">Loading Globe...</p>
      </div>
    </div>
  ),
});
