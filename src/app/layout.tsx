import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from '@/components/Providers';
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
  title: "Dhanypedia | GIS Portfolio",
  description: "Explore my GIS projects across Asia through an interactive 3D globe experience. Specializing in geospatial analysis, mapping, and spatial data solutions.",
  keywords: ["GIS", "Portfolio", "Geospatial", "Mapping", "Indonesia", "Asia", "Spatial Analysis"],
  authors: [{ name: "Dhanypedia" }],
  openGraph: {
    title: "Dhanypedia | GIS Portfolio",
    description: "Explore my GIS projects across Asia through an interactive 3D globe experience.",
    type: "website",
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
