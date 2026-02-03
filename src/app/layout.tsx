import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from '@/components/Providers';
import { StructuredData } from '@/lib/seo';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  
  title: {
    default: 'Dhanypedia | GIS Portfolio & Geospatial Analysis',
    template: '%s | Dhanypedia'
  },
  
  description: 'Explore professional GIS projects across Asia through an interactive 3D globe. Specializing in geospatial analysis, WebGIS development, spatial data solutions, and mapping technologies.',
  
  keywords: [
    'GIS Portfolio',
    'Geospatial Analysis',
    'WebGIS Developer',
    'Spatial Data Solutions',
    'Interactive Mapping',
    'Indonesia GIS',
    'Asia Geospatial',
    '3D Globe Visualization',
    'MapLibre GL JS',
    'QGIS',
    'PostGIS',
    'Cartography',
    'Remote Sensing',
    'Spatial Database',
    'GIS Consultant'
  ],
  
  authors: [{ name: 'Dhanypedia', url: 'https://github.com/dhanypedia' }],
  creator: 'Dhanypedia',
  publisher: 'Dhanypedia',
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Dhanypedia GIS Portfolio',
    title: 'Dhanypedia | GIS Portfolio & Geospatial Analysis',
    description: 'Explore professional GIS projects across Asia through an interactive 3D globe. Specializing in geospatial analysis, WebGIS development, and spatial data solutions.',
    images: [
      {
        url: '/og-image.png', // We'll create this
        width: 1200,
        height: 630,
        alt: 'Dhanypedia GIS Portfolio - Interactive 3D Globe with Projects',
        type: 'image/png',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Dhanypedia | GIS Portfolio & Geospatial Analysis',
    description: 'Explore professional GIS projects across Asia through an interactive 3D globe.',
    images: ['/og-image.png'],
    creator: '@dhanypedia', // Update with actual Twitter handle if available
  },
  
  verification: {
    // Add when you set up Google Search Console
    // google: 'your-google-verification-code',
  },
  
  alternates: {
    canonical: '/',
  },
  
  other: {
    'theme-color': '#38bdf8', // Cyan accent color
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* SEO Structured Data */}
        <StructuredData />
        
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <Toaster 
          position="top-center"
          theme="dark"
          closeButton
          richColors
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-primary)',
            }
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
