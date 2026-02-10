'use client';

import { useEffect, useState } from 'react';
import type { Project, About } from '@/types';
import { MapPin, Calendar, ExternalLink, CheckCircle, Sun, Moon } from 'lucide-react';

// Theme color definitions
const themes = {
  light: {
    bg: '#ffffff',
    bgSecondary: '#f5f5f5',
    text: '#111111',
    textSecondary: '#333333',
    textMuted: '#666666',
    border: '#e5e5e5',
    accent: '#2563eb',
    accentBg: '#111111',
    accentText: '#ffffff',
    tagBg: '#f0f0f0',
    tagBorder: '#e0e0e0',
    success: '#22c55e'
  },
  dark: {
    bg: '#0f172a',
    bgSecondary: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#e2e8f0',
    textMuted: '#94a3b8',
    border: '#334155',
    accent: '#38bdf8',
    accentBg: '#38bdf8',
    accentText: '#0f172a',
    tagBg: '#1e293b',
    tagBorder: '#475569',
    success: '#4ade80'
  }
};

type Theme = 'light' | 'dark';

export default function PrintPortfolioPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  const colors = themes[theme];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, projectsRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/projects')
        ]);
        
        if (aboutRes.ok) {
          const aboutData = await aboutRes.json();
          setAbout(aboutData);
        }
        
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          const projectList = Array.isArray(projectsData) ? projectsData : (projectsData.projects || []);
          setProjects(projectList.filter((p: Project) => p.is_visible));
        }
      } catch (err) {
        console.error('Failed to load portfolio data', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Set document title for PDF
    document.title = `${about?.name || 'Portfolio'} - Print`;
    
    // Add print-specific class to body
    document.body.classList.add('printing');
    
    return () => {
      document.body.classList.remove('printing');
    };
  }, [about?.name]);

  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: colors.text, fontSize: '18px' }}>Loading portfolio data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: 'Arial, sans-serif' }}>
      {/* Control Bar - Hidden when printing */}
      <div className="no-print" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, 
        backgroundColor: theme === 'dark' ? '#1e293b' : '#1e40af', 
        color: '#fff', 
        padding: '12px 24px', zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        printColorAdjust: 'exact',
        WebkitPrintColorAdjust: 'exact'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <strong>Portfolio Preview</strong>
          
          {/* Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '8px' }}>
            <button 
              onClick={() => setTheme('light')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                backgroundColor: theme === 'light' ? '#fff' : 'transparent',
                color: theme === 'light' ? '#111' : '#fff',
                fontWeight: theme === 'light' ? 'bold' : 'normal'
              }}
            >
              <Sun size={16} /> Light
            </button>
            <button 
              onClick={() => setTheme('dark')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                backgroundColor: theme === 'dark' ? '#0f172a' : 'transparent',
                color: '#fff',
                fontWeight: theme === 'dark' ? 'bold' : 'normal'
              }}
            >
              <Moon size={16} /> Dark
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>{projects.length} Projects</span>
          <span style={{ opacity: 0.7 }}>Press Cmd/Ctrl + P to save as PDF</span>
        </div>
      </div>

      <div style={{ paddingTop: '70px' }} className="print-no-padding">
        
        {/* ========== COVER PAGE ========== */}
        <div className="page" style={{ 
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: colors.bg,
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ 
                fontSize: '56px', 
                fontWeight: 'bold', 
                color: '#000000',
                lineHeight: 1.1,
                display: 'inline-block'
              }}>
                {about?.name || 'Dhany Yudi Prasetyo'}
              </span>
            </div>
            
            <h2 style={{ 
              fontSize: '24px', 
              color: colors.textMuted,
              fontWeight: 400,
              marginBottom: '32px'
            }}>
              {about?.title}
            </h2>

            <div style={{ 
              borderTop: `4px solid ${colors.text}`, 
              paddingTop: '32px',
              marginTop: '32px'
            }}>
              <p style={{ 
                fontSize: '16px', 
                color: colors.textSecondary,
                lineHeight: 1.8,
                whiteSpace: 'pre-line'
              }}>
                {about?.summary}
              </p>
            </div>

            <div style={{ 
              marginTop: '48px', 
              display: 'flex', 
              gap: '48px'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Projects
                </div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: colors.accent }}>
                  {projects.length}
                </div>
              </div>
              {about?.skills && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Technologies
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: colors.accent }}>
                    {about.skills.reduce((acc, group) => acc + group.items.length, 0)}+
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '64px', fontSize: '14px', color: colors.textMuted }}>
              Portfolio Document • Generated {new Date().toLocaleDateString()} • {theme.toUpperCase()} MODE
            </div>
          </div>
        </div>

        {/* ========== PROJECT PAGES ========== */}
        {projects.map((project, projectIndex) => (
          <div key={project.id} className="page" style={{ 
            padding: '36px 48px',
            backgroundColor: colors.bg,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Project Header */}
            <div className="project-header" style={{ 
              borderBottom: `3px solid ${colors.border}`, 
              paddingBottom: '20px', 
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexShrink: 0
            }}>
              <div>
                <div style={{ fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Project {projectIndex + 1} of {projects.length}
                </div>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: colors.text,
                  marginBottom: '12px'
                }}>
                  {project.title}
                </h2>
                <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: colors.textMuted }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {project.location?.name || 'N/A'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {project.year}
                  </span>
                  {project.external_link && (
                    <a href={project.external_link} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: colors.accent }}>
                      <ExternalLink size={14} /> View Project
                    </a>
                  )}
                </div>
              </div>
              {project.category && (
                <span style={{ 
                  padding: '8px 16px', 
                  backgroundColor: colors.accentBg, 
                  color: colors.accentText, 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  textTransform: 'uppercase',
                  borderRadius: '4px'
                }}>
                  {project.category}
                </span>
              )}
            </div>

            {/* Gallery Grid - Show max 3 images */}
            {project.media && project.media.length > 0 && (
              <div className="project-gallery" style={{ 
                marginBottom: '20px', 
                flexShrink: 0,
                height: '140px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2fr 1fr', 
                  gridTemplateRows: 'repeat(2, 65px)',
                  gap: '10px',
                  height: '100%'
                }}>
                  {project.media.slice(0, 3).map((media, mediaIndex) => {
                    const isVideo = media.type === 'video' || media.url?.includes('youtube') || media.url?.includes('youtu.be');
                    const imageSrc = isVideo ? getYouTubeThumbnail(media.url) : media.url;
                    const isMainImage = mediaIndex === 0;
                    
                    return (
                      <div 
                        key={mediaIndex}
                        style={{
                          gridColumn: isMainImage ? 'span 1' : 'span 1',
                          gridRow: isMainImage ? 'span 2' : 'span 1',
                          backgroundColor: colors.bgSecondary,
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: `1px solid ${colors.border}`,
                          position: 'relative'
                        }}
                      >
                        {imageSrc && (
                          <img 
                            src={imageSrc}
                            alt={`${project.title} - Image ${mediaIndex + 1}`}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover', 
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              left: 0
                            }}
                            crossOrigin="anonymous"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="project-content" style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr', 
              gap: '24px', 
              flex: 1, 
              minHeight: 0,
              overflow: 'hidden'
            }}>
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>
                  Description
                </h3>
                <p className="desc-text" style={{ 
                  fontSize: '13px', 
                  color: colors.textSecondary, 
                  lineHeight: 1.6, 
                  margin: 0,
                  textAlign: 'justify'
                }}>
                  {project.description}
                </p>

                {project.impacts && project.impacts.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '6px' }}>
                      Key Impacts
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {project.impacts.slice(0, 4).map((impact, i) => (
                        <li key={i} style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '6px', 
                          marginBottom: '4px', 
                          fontSize: '11px', 
                          color: colors.textSecondary, 
                          lineHeight: 1.4,
                          textAlign: 'justify'
                        }}>
                          <span style={{ color: colors.success, flexShrink: 0 }}>✓</span>
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>
                  Technologies Used
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.tech_stack?.slice(0, 8).map((tech, i) => (
                    <span key={i} style={{ 
                      padding: '4px 8px', 
                      backgroundColor: colors.tagBg, 
                      border: `1px solid ${colors.tagBorder}`,
                      borderRadius: '3px',
                      fontSize: '11px',
                      color: colors.textSecondary
                    }}>
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack && project.tech_stack.length > 8 && (
                    <span style={{ fontSize: '11px', color: colors.textMuted, fontStyle: 'italic' }}>
                      +{project.tech_stack.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        /* ===== PRINT STYLES ===== */
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 12mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            -webkit-tap-highlight-color: transparent !important;
          }
          


          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-no-padding {
            padding-top: 0 !important;
          }
          
          /* Each page is a A4 container */
          .page {
            width: 186mm; /* A4 width minus margins (210mm - 24mm) */
            min-height: 267mm; /* A4 height minus margins (297mm - 30mm) */
            page-break-after: always;
            break-after: page;
            break-inside: avoid;
            overflow: visible;
            position: relative;
            box-sizing: border-box;
            margin: 0 auto;
            padding: 0;
          }
          
          /* Last page shouldn't have page break */
          .page:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          
          /* Prevent content from breaking inside */
          .project-header,
          .project-gallery,
          .project-content {
            break-inside: avoid;
            position: relative;
          }
          
          /* Ensure images don't break and don't overlap */
          img {
            break-inside: avoid;
            max-width: 100%;
            position: relative !important;
          }
          
          /* Force proper box model for all elements */
          .page * {
            box-sizing: border-box;
          }
          
          /* Ensure text doesn't overflow */
          p, li {
            overflow-wrap: break-word;
            word-wrap: break-word;
            hyphens: auto;
          }
          

          /* Links - show URL after text */
          a[href]:after {
            content: "";
          }
        }
        
        /* ===== SCREEN PREVIEW STYLES ===== */
        @media screen {
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: ${colors.bg};
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border-bottom: none;
            overflow: visible;
            position: relative;
            box-sizing: border-box;
          }
          
          /* Show page boundaries for debugging */
          .page::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: repeating-linear-gradient(
              90deg,
              ${colors.border} 0px,
              ${colors.border} 10px,
              transparent 10px,
              transparent 20px
            );
          }
        }
      `}</style>
    </div>
  );
}
