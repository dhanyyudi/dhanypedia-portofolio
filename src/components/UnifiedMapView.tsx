'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { renderToString } from 'react-dom/server';
import { Building2, Trees, Zap, Navigation, Pickaxe, Waves, Globe2, Terminal, PieChart, Box, MapPin } from 'lucide-react';
import type { Project } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface UnifiedMapViewProps {
  projects: Project[];
  activeProject: Project | null;
  onProjectClick: (project: Project) => void;
}

// Icon Helper (same as before)
const getProjectStyle = (project: Project, size: number = 16): { icon: React.ReactNode, color: string } => {
  if (project.category) {
    switch (project.category) {
      case 'enterprise': return { icon: <Globe2 size={size} />, color: '#3b82f6' };
      case 'intelligence': return { icon: <PieChart size={size} />, color: '#f59e0b' };
      case 'engineering': return { icon: <Terminal size={size} />, color: '#22c55e' };
      case 'frontier': return { icon: <Box size={size} />, color: '#a855f7' };
      case 'urban': return { icon: <Building2 size={size} />, color: '#3b82f6' };
      case 'environment': return { icon: <Trees size={size} />, color: '#22c55e' };
      case 'water': return { icon: <Waves size={size} />, color: '#0ea5e9' };
      case 'mining': return { icon: <Pickaxe size={size} />, color: '#f59e0b' };
      case 'transport': return { icon: <Navigation size={size} />, color: '#ef4444' };
      case 'energy': return { icon: <Zap size={size} />, color: '#eab308' };
    }
  }

  const t = project.title.toLowerCase();
  if (t.includes('bappenas') || t.includes('sitaswil') || t.includes('jtts webgis')) 
    return { icon: <Globe2 size={size} />, color: '#3b82f6' };
  if (t.includes('dashboard') || t.includes('analytics') || t.includes('geotechnical')) 
    return { icon: <PieChart size={size} />, color: '#f59e0b' };
  if (t.includes('osrm') || t.includes('geofence') || t.includes('waypoint')) 
    return { icon: <Terminal size={size} />, color: '#22c55e' };
  if (t.includes('3d') || t.includes('merapi') || t.includes('redesign')) 
    return { icon: <Box size={size} />, color: '#a855f7' };

  return { icon: <MapPin size={size} />, color: '#ffffff' };
};

export default function UnifiedMapView({ projects, activeProject, onProjectClick }: UnifiedMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isGlobeView, setIsGlobeView] = useState(true);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);  // Track style loading
  const { theme } = useTheme();

  // Get appropriate basemap style based on theme
  const getMapStyle = (currentTheme: string) => {
    if (currentTheme === 'dark') {
      // Dark basemap for dark mode
      return {
        version: 8 as const,
        sources: {
          'osm': {
            type: 'raster' as const,
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            ],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster' as const,
            source: 'osm',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    } else {
      // Light basemap for light mode  
      return {
        version: 8 as const,
        sources: {
          'osm': {
            type: 'raster' as const,
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            ],
            tileSize: 256,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster' as const,
            source: 'osm',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: getMapStyle(theme),
        center: [115, 5], // Center on Southeast Asia
        zoom: 2.5,
        attributionControl: {
          compact: true
        }
      });

      // Add navigation controls (zoom +/- buttons)
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      
      // Push zoom controls below toggle button
      setTimeout(() => {
        const topRightControls = document.querySelector('.maplibregl-ctrl-top-right');
        if (topRightControls) {
          (topRightControls as HTMLElement).style.marginTop = '168px';
          (topRightControls as HTMLElement).style.marginRight = '16px';
          const mediaQuery = window.matchMedia('(min-width: 768px)');
          const adjustMargin = () => {
            if (topRightControls) {
              (topRightControls as HTMLElement).style.marginTop = mediaQuery.matches ? '152px' : '168px';
              (topRightControls as HTMLElement).style.marginRight = mediaQuery.matches ? '24px' : '16px';
            }
          };
          adjustMargin();
          mediaQuery.addEventListener('change', adjustMargin);
        }
      }, 100);

      // Set globe projection AFTER style loads
      map.current.on('style.load', () => {
        if (!map.current) return;
        setIsStyleLoaded(true);
        try {
          map.current.setProjection({ type: 'globe' } as any);
          setIsMapLoaded(true);
        } catch (e) {
          console.warn('Projection set failed:', e);
        }
      });

      // Listen for zoom changes
      map.current.on('zoom', () => {
        if (!map.current || !isStyleLoaded) return;
        try {
          if (!map.current.isStyleLoaded()) return;
          const zoom = map.current.getZoom();
          if (zoom >= 6 && isGlobeView) {
            map.current.setProjection({ type: 'mercator' } as any);
            setIsGlobeView(false);
          } else if (zoom < 6 && !isGlobeView) {
            map.current.setProjection({ type: 'globe' } as any);
            setIsGlobeView(true);
          }
        } catch (e) {
          // Ignore zoom errors
        }
      });

      // Error handling for map
      map.current.on('error', (e) => {
        console.warn('Map error:', e);
      });

    } catch (error) {
      console.error('Failed to initialize map (likely WebGL missing):', error);
      // Fallback behavior - we could set a state here to show a static image or message
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '<div class="flex items-center justify-center h-full text-white/50 bg-slate-900">Map unavailable (WebGL required)</div>';
      }
    }

    // Cleanup
    return () => {
      try {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current.clear();
        map.current?.remove();
        map.current = null;
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  // Update map style when theme changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    setIsStyleLoaded(false);  // Mark as not loaded during transition
    const newStyle = getMapStyle(theme);
    map.current.setStyle(newStyle as any);

    // Re-apply globe projection after style change
    map.current.once('style.load', () => {
      if (!map.current) return;
      setIsStyleLoaded(true);  // Mark as loaded
      if (isGlobeView) {
        map.current.setProjection({ type: 'globe' } as any);
      } else {
        map.current.setProjection({ type: 'mercator' } as any);
      }
    });
  }, [theme, isMapLoaded, isGlobeView]);

  // Update markers when projects or activeProject changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Add markers for all projects
    projects.forEach((project) => {
      const isActive = activeProject?.id === project.id;
      const style = getProjectStyle(project, isActive ? 24 : 18);
      const iconHtml = renderToString(style.icon);
      
      const borderColor = isActive ? '#38bdf8' : style.color;
      const glowColor = isActive ? '#38bdf8' : style.color;
      const textColor = isActive ? '#38bdf8' : style.color;
      const size = isActive ? '48px' : '40px';
      const activeClass = isActive ? 'z-50 scale-110' : 'z-10 opacity-90 hover:opacity-100 hover:scale-105';
      
      // Get theme-aware colors from CSS variables
      const markerBg = theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      const tooltipBg = theme === 'dark' ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.95)';
      const tooltipBorder = isActive 
        ? (theme === 'dark' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(2, 132, 199, 0.5)')
        : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
      const tooltipText = theme === 'dark' ? '#e2e8f0' : '#0f172a';

      const el = document.createElement('div');
      el.className = 'unified-marker';
      el.innerHTML = `
        <div class="flex flex-col items-center transition-all duration-300 ${activeClass}" style="transform-origin: center bottom;">
          <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${size};
              height: ${size};
              background: ${markerBg};
              border: 2px solid ${borderColor};
              border-radius: 50%;
              color: ${textColor};
              backdrop-filter: blur(8px);
              box-shadow: 0 0 ${isActive ? '30px' : '15px'} ${glowColor}66;
              cursor: pointer;
          ">
              ${iconHtml}
          </div>
          <div style="
              margin-top: 8px;
              background: ${tooltipBg};
              border: 1px solid ${tooltipBorder};
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              color: ${tooltipText};
              white-space: nowrap;
              backdrop-filter: blur(4px);
              box-shadow: 0 4px 6px -1px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'};
              cursor: pointer;
          ">
              ${project.title}
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        onProjectClick(project);
      });

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([project.location.longitude, project.location.latitude])
        .addTo(map.current!);

      markersRef.current.set(project.id, marker);
    });
  }, [projects, activeProject, isMapLoaded, onProjectClick, theme]); // Added theme dependency

  // Fly to active project when it changes
  useEffect(() => {
    if (!map.current || !isMapLoaded || !activeProject) return;

    map.current.flyTo({
      center: [activeProject.location.longitude, activeProject.location.latitude],
      zoom: 13, // High zoom = auto-switch to flat map
      duration: 1500,
      essential: true
    });
  }, [activeProject, isMapLoaded]);

  // Manual toggle function
  const toggleProjection = () => {
    if (!map.current || !isStyleLoaded) return;  // GUARD: check style loaded
    
    // Additional guard
    try {
      if (!map.current.isStyleLoaded()) return;
    } catch (e) {
      return;
    }

    if (isGlobeView) {
      // Switch to flat map
      map.current.setProjection({ type: 'mercator' } as any);
      map.current.easeTo({ zoom: 8, duration: 1000 });
      setIsGlobeView(false);
    } else {
      // Switch to globe
      map.current.setProjection({ type: 'globe' } as any);
      map.current.easeTo({ 
        zoom: 2.5, 
        center: [115, 5],
        duration: 1000 
      });
      setIsGlobeView(true);
    }
  };

  return (
    <div className="absolute inset-0 z-0">
      {/* Toggle button - positioned right below navbar with comfortable spacing */}
      <button 
        onClick={toggleProjection}
        className="fixed top-28 md:top-24 right-4 md:right-6 z-40 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 
                   backdrop-blur-md
                   shadow-lg 
                   rounded-full border
                   transition-all duration-300 hover:scale-105 text-xs md:text-sm
                   dark:bg-slate-900/90 dark:border-cyan-500/50 dark:text-cyan-400 dark:hover:text-cyan-300 dark:hover:border-cyan-400 dark:shadow-cyan-500/20
                   bg-white/90 border-sky-600/50 text-sky-600 hover:text-sky-700 hover:border-sky-700 shadow-sky-600/20"
      >
        <Globe2 size={16} className="md:w-[18px] md:h-[18px]" />
        <span className="font-medium">
          {isGlobeView ? '2D Map' : '3D Globe'}
        </span>
      </button>

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
