import type { Metadata } from 'next';
import { Person, WithContext, WebSite } from 'schema-dts';

/**
 * Structured Data for SEO
 * JSON-LD format for rich search results
 */

export const personSchema: WithContext<Person> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dhany Yudi Prasetyo',
  jobTitle: 'GIS Developer & Geospatial Analyst',
  description: 'Professional GIS developer specializing in WebGIS development, geospatial analysis, and interactive mapping solutions across Asia.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dhanypedia.com',
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dhanypedia.com'}/og-image.png`,
  sameAs: [
    'https://github.com/dhanyyudi',
    'https://linkedin.com/in/dhanyyudi', // Update with actual profile
    // Add other social profiles
  ],
  knowsAbout: [
    'Geographic Information Systems (GIS)',
    'WebGIS Development',
    'Geospatial Analysis',
    'Spatial Data Solutions',
    'Interactive Mapping',
    'MapLibre GL JS',
    'QGIS',
    'PostGIS',
    'Remote Sensing',
    'Cartography',
  ],
  alumniOf: {
    '@type': 'Organization',
    name: 'Your University', // Update with actual education
  },
};

export const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dhany Yudi Prasetyo GIS Portfolio',
  description: 'Professional GIS portfolio showcasing geospatial projects across Asia with interactive 3D globe visualization.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dhanypedia.com',
  author: {
    '@type': 'Person',
    name: 'Dhany Yudi Prasetyo',
  },
  inLanguage: 'en-US',
};

/**
 * Component to inject JSON-LD structured data into page head
 * Using dangerouslySetInnerHTML to ensure correct script tag execution in Next.js
 */
export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}

/**
 * Generate metadata for dynamic pages
 */
export function generatePageMetadata(params: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const { title, description, path = '/', image = '/og-image.png' } = params;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: path,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: path,
    },
  };
}
