import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Cluster projects based on zoom level and distance
export function clusterProjects<T extends { location: { latitude: number; longitude: number } }>(
  projects: T[],
  clusterRadius: number = 500 // in km
): { center: { lat: number; lng: number }; items: T[] }[] {
  const clusters: { center: { lat: number; lng: number }; items: T[] }[] = [];
  const used = new Set<number>();

  projects.forEach((project, i) => {
    if (used.has(i)) return;

    const cluster: T[] = [project];
    used.add(i);

    projects.forEach((other, j) => {
      if (i === j || used.has(j)) return;

      const distance = calculateDistance(
        project.location.latitude,
        project.location.longitude,
        other.location.latitude,
        other.location.longitude
      );

      if (distance <= clusterRadius) {
        cluster.push(other);
        used.add(j);
      }
    });

    // Calculate cluster center
    const centerLat =
      cluster.reduce((sum, p) => sum + p.location.latitude, 0) / cluster.length;
    const centerLng =
      cluster.reduce((sum, p) => sum + p.location.longitude, 0) / cluster.length;

    clusters.push({
      center: { lat: centerLat, lng: centerLng },
      items: cluster,
    });
  });

  return clusters;
}

// Extract YouTube video ID from URL
export function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Check if URL is a video embed
export function isVideoUrl(url: string): boolean {
  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com')
  );
}
