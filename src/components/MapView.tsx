'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { DivIcon } from 'leaflet';
import { Building2, Trees, Zap, Navigation, Pickaxe, Waves, Globe2 } from 'lucide-react';
import type { Project } from '@/types';

// Props Interface
interface MapViewProps {
  projects: Project[];
  activeProject: Project | null;
  onClose: () => void;
  onProjectClick: (project: Project) => void;
  initialCenter?: { lat: number; lng: number } | null;
}

// MapUpdater Component
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, {
      duration: 1.5
    });
  }, [center, map]);
  return null;
}

// Icon Helper (Same as Globe.tsx)
const getProjectIcon = (title: string, size: number = 16) => {
  const t = title.toLowerCase();
  if (t.includes('urban') || t.includes('city') || t.includes('infrastructure')) return <Building2 size={size} />;
  if (t.includes('forest') || t.includes('agriculture') || t.includes('land')) return <Trees size={size} />;
  if (t.includes('flood') || t.includes('water') || t.includes('coastal')) return <Waves size={size} />;
  if (t.includes('mining') || t.includes('reclamation')) return <Pickaxe size={size} />;
  if (t.includes('transport')) return <Navigation size={size} />;
  return <Zap size={size} />;
};

const createCustomMarker = (project: Project, isActive: boolean) => {
    const iconHtml = renderToString(getProjectIcon(project.title, isActive ? 24 : 18));
    const color = isActive ? '#38bdf8' : '#ffffff';
    const size = isActive ? '48px' : '40px';
    const activeClass = isActive ? 'z-50 scale-110' : 'z-10 opacity-90 hover:opacity-100 hover:scale-105';

    const html = `
      <div class="flex flex-col items-center transition-all duration-300 ${activeClass}" style="transform-origin: center bottom;">
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
            backdrop-filter: blur(8px);
            box-shadow: 0 0 ${isActive ? '30px' : '15px'} ${color};
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
        ">
            ${project.title}
        </div>
      </div>
    `;

    return new DivIcon({
        html: html,
        className: 'bg-transparent',
        iconSize: [60, 80],
        iconAnchor: [30, 40],
    });
};

export default function MapView({ projects, activeProject, onClose, onProjectClick, initialCenter }: MapViewProps) {
  const centerLat = activeProject ? activeProject.location.latitude : initialCenter?.lat;
  const centerLng = activeProject ? activeProject.location.longitude : initialCenter?.lng;

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

      <MapContainer
        key={`map-${centerLat}-${centerLng}`}
        center={[centerLat, centerLng]}
        zoom={activeProject ? 13 : 8} 
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
        zoomControl={false}
      >
        <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Render ALL Projects as Custom Markers */}
        {projects.map((project) => {
            const isActive = activeProject?.id === project.id;
            return (
                <Marker 
                  key={`${project.id}-${isActive ? 'active' : 'inactive'}`}
                  position={[project.location.latitude, project.location.longitude]}
                  icon={createCustomMarker(project, isActive)}
                  eventHandlers={{
                    click: () => onProjectClick(project)
                  }}
                />
            );
        })}

        <MapUpdater center={[centerLat, centerLng]} />
      </MapContainer>
    </div>
  );
}

