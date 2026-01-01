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
  }, []);

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
        backgroundColor: theme === 'dark' ? '#1e293b' : '#2563eb', 
        color: '#fff', 
        padding: '12px 24px', zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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
          minHeight: '100vh', 
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: colors.bg
        }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ 
              fontSize: '56px', 
              fontWeight: 'bold', 
              color: colors.text,
              marginBottom: '16px',
              lineHeight: 1.1
            }}>
              {about?.name || 'My Portfolio'}
            </h1>
            
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
            minHeight: '100vh', 
            padding: '48px',
            backgroundColor: colors.bg,
            pageBreakBefore: 'always'
          }}>
            {/* Project Header */}
            <div style={{ 
              borderBottom: `3px solid ${colors.border}`, 
              paddingBottom: '24px', 
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
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

            {/* Gallery Grid */}
            {project.media && project.media.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '12px' 
                }}>
                  {project.media.slice(0, 6).map((media, mediaIndex) => {
                    const isVideo = media.type === 'video' || media.url?.includes('youtube') || media.url?.includes('youtu.be');
                    const imageSrc = isVideo ? getYouTubeThumbnail(media.url) : media.url;
                    const isMainImage = mediaIndex === 0;
                    
                    return (
                      <div 
                        key={mediaIndex}
                        style={{
                          gridColumn: isMainImage ? 'span 2' : 'span 1',
                          gridRow: isMainImage ? 'span 2' : 'span 1',
                          height: isMainImage ? '280px' : '130px',
                          backgroundColor: colors.bgSecondary,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        {imageSrc && (
                          <img 
                            src={imageSrc}
                            alt={`${project.title} - Image ${mediaIndex + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>
                  Description
                </h3>
                <p style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.8 }}>
                  {project.description}
                </p>

                {project.impacts && project.impacts.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>
                      Key Impacts
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {project.impacts.map((impact, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '14px', color: colors.textSecondary }}>
                          <CheckCircle size={16} style={{ color: colors.success, marginTop: '2px', flexShrink: 0 }} />
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>
                  Technologies Used
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.tech_stack?.map((tech, i) => (
                    <span key={i} style={{ 
                      padding: '6px 12px', 
                      backgroundColor: colors.tagBg, 
                      border: `1px solid ${colors.tagBorder}`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: colors.textSecondary
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-no-padding {
            padding-top: 0 !important;
          }
          
          .page {
            page-break-after: always;
            break-after: page;
          }
        }
        
        @media screen {
          .page {
            border-bottom: 3px dashed ${colors.border};
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
