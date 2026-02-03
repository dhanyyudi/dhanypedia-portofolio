'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { renderToString } from 'react-dom/server';
import { Building2, Trees, Zap, Navigation, Pickaxe, Waves, Globe2, Terminal, PieChart, Box, Layers, MapPin } from 'lucide-react';
import type { Project } from '@/types';

// Props Interface
interface MapViewProps {
  projects: Project[];
  activeProject: Project | null;
  onClose: () => void;
  onProjectClick: (project: Project) => void;
  initialCenter?: { lat: number; lng: number } | null;
}

// Icon Helper (Synced with Globe.tsx)
const getProjectStyle = (project: Project, size: number = 16): { icon: React.ReactNode, color: string } => {
  // Use explicit category if available
  if (project.category) {
    switch (project.category) {
      // 1. Enterprise WebGIS Systems (Blue)
      case 'enterprise': 
        return { icon: <Globe2 size={size} />, color: '#3b82f6' }; // Blue-500
      
      // 2. Spatial Data Intelligence (Orange/Yellow)
      case 'intelligence': 
        return { icon: <PieChart size={size} />, color: '#f59e0b' }; // Amber-500
      
      // 3. Geospatial Software Engineering (Green)
      case 'engineering': 
        return { icon: <Terminal size={size} />, color: '#22c55e' }; // Green-500
      
      // 4. Frontier Tech & Design (Purple)
      case 'frontier': 
        return { icon: <Box size={size} />, color: '#a855f7' }; // Purple-500
        
      // Legacy / Fallbacks
      case 'urban': return { icon: <Building2 size={size} />, color: '#3b82f6' };
      case 'environment': return { icon: <Trees size={size} />, color: '#22c55e' };
      case 'water': return { icon: <Waves size={size} />, color: '#0ea5e9' };
      case 'mining': return { icon: <Pickaxe size={size} />, color: '#f59e0b' };
      case 'transport': return { icon: <Navigation size={size} />, color: '#ef4444' };
      case 'energy': return { icon: <Zap size={size} />, color: '#eab308' };
    }
  }

  // Fallback to title matching
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

export default function MapViewMaplibre({ projects, activeProject, onClose, onProjectClick, initialCenter }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const centerLat = activeProject ? activeProject.location.latitude : initialCenter?.lat;
  const centerLng = activeProject ? activeProject.location.longitude : initialCenter?.lng;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    if (
      centerLat === undefined || 
      centerLng === undefined || 
      centerLat === null || 
      centerLng === null ||
      Number.isNaN(centerLat) || 
      Number.isNaN(centerLng)
    ) {
      return;
    }

    // Initialize map with Maplibre's built-in dark demo style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json', // Maplibre's built-in demo tiles
      center: [centerLng, centerLat],
      zoom: activeProject ? 13 : 8,
      attributionControl: {
        compact: true
      }


    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left');

    // Set loaded flag
    map.current.on('load', () => {
      setIsMapLoaded(true);
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);

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
      
      // Active state always uses bright cyan, inactive uses category color
      const borderColor = isActive ? '#38bdf8' : style.color;
      const glowColor = isActive ? '#38bdf8' : style.color;
      const textColor = isActive ? '#38bdf8' : style.color;
      
      const size = isActive ? '48px' : '40px';
      const activeClass = isActive ? 'z-50 scale-110' : 'z-10 opacity-90 hover:opacity-100 hover:scale-105';

      // Create marker element
      const el = document.createElement('div');
      el.className = 'maplibre-marker';
      el.innerHTML = `
        <div class="flex flex-col items-center transition-all duration-300 ${activeClass}" style="transform-origin: center bottom;">
          <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${size};
              height: ${size};
              background: rgba(15, 23, 42, 0.9);
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
              background: rgba(2, 6, 23, 0.9);
              border: 1px solid ${isActive ? 'rgba(56, 189, 248, 0.5)' : 'rgba(255,255,255,0.1)'};
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              color: #e2e8f0;
              white-space: nowrap;
              backdrop-filter: blur(4px);
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
              cursor: pointer;
          ">
              ${project.title}
          </div>
        </div>
      `;

      // Add click handler
      el.addEventListener('click', () => {
        onProjectClick(project);
      });

      // Create and add marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([project.location.longitude, project.location.latitude])
        .addTo(map.current!);

      markersRef.current.set(project.id, marker);
    });
  }, [projects, activeProject, isMapLoaded, onProjectClick]);

  // Fly to active project when it changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    if (activeProject) {
      map.current.flyTo({
        center: [activeProject.location.longitude, activeProject.location.latitude],
        zoom: 13,
        duration: 1500,
        essential: true
      });
    }
  }, [activeProject, isMapLoaded]);

  if (
    centerLat === undefined || 
    centerLng === undefined || 
    centerLat === null || 
    centerLng === null ||
    Number.isNaN(centerLat) || 
    Number.isNaN(centerLng)
  ) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-[5] animate-fade-in">
      {/* Back to Globe Button - positioned below navbar with responsive sizing */}
      <button 
        onClick={onClose}
        className="absolute top-24 md:top-20 right-2 md:right-4 z-50 flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 
                   bg-slate-900/90 border border-cyan-500/50 rounded-full 
                   text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 
                   backdrop-blur-md shadow-lg shadow-cyan-500/20
                   transition-all duration-300 hover:scale-105 text-xs md:text-sm"
      >
        <Globe2 size={16} className="md:w-[18px] md:h-[18px]" />
        <span className="font-medium">Back to Globe</span>
      </button>

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
