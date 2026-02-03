'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  MapPin,
  Briefcase,
  GraduationCap,
  Code2,
  Globe2,
  Cpu,
  Layers,
  Instagram,
  Facebook,
  Link as LinkIcon
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { sampleAbout } from '@/data/sample';
import { useRef, useState, useEffect } from 'react';

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={20} />,
  linkedin: <Linkedin size={20} />,
  twitter: <Twitter size={20} />,
  mail: <Mail size={20} />,
  instagram: <Instagram size={20} />,
  facebook: <Facebook size={20} />,
  other: <LinkIcon size={20} />,
};

// Helper to get icon with fallback
const getIcon = (link: { icon?: string; platform?: string }) => {
  // Try icon first, then platform, then default
  const key = link.icon || link.platform || '';
  return iconMap[key] || <LinkIcon size={20} />;
};

export default function AboutPage() {
  const [about, setAbout] = useState<typeof sampleAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  
  // Only use scroll effects after mount to prevent hydration mismatch
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
              setAbout({
                  ...sampleAbout,
                  ...data,
                  skills: data.skills || sampleAbout.skills,
                  experience: data.experience || sampleAbout.experience,
                  education: data.education || sampleAbout.education,
                  social_links: data.social_links || sampleAbout.social_links
              });
          } else {
            // Use sample data if API returns empty
            setAbout(sampleAbout);
          }
        } else {
          setAbout(sampleAbout);
        }
      } catch (e) {
        console.error("Failed to fetch about data", e);
        setAbout(sampleAbout);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleDownloadCV = () => {
    if (about?.cv_url) {
      window.open(about.cv_url, '_blank');
    } else {
      alert("CV not uploaded yet");
    }
  };

  // Show loading skeleton while fetching data
  if (loading || !about) {
    return (
      <main className="min-h-screen bg-[var(--background-primary)]">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Profile Skeleton */}
            <div className="lg:col-span-4">
              <div className="glass-card p-8 animate-pulse">
                <div className="w-40 h-40 mx-auto mb-6 bg-white/10 rounded-full" />
                <div className="h-8 bg-white/10 rounded mb-4 mx-auto w-3/4" />
                <div className="h-4 bg-white/10 rounded mb-6 mx-auto w-1/2" />
                <div className="flex justify-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-xl" />
                  <div className="w-12 h-12 bg-white/10 rounded-xl" />
                </div>
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="lg:col-span-8 space-y-8">
              <div className="glass-card p-8 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-1/4 mb-4" />
                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                <div className="h-4 bg-white/10 rounded w-5/6 mb-2" />
                <div className="h-4 bg-white/10 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background-primary)] overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-white" ref={containerRef}>
      <Navigation />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-primary)]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--accent-secondary)]/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Sticky Profile (Desktop) */}
          <div className="lg:col-span-4 lg:relative">
            <div className="lg:sticky lg:top-32 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-card p-8 border border-[var(--accent-primary)]/20 relative overflow-hidden group"
              >
                 {/* Holographic Shine Effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                 
                 <div className="relative z-10 text-center">
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-primary)] border-dashed animate-spin-slow" />
                      {about.photo_url || about.photo ? (
                        <img
                          src={about.photo_url || about.photo}
                          alt={about.name}
                          className="w-full h-full object-cover rounded-full border-4 border-[var(--background-card)] shadow-2xl"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                            <span className="text-4xl">🧑‍💻</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 right-2 w-4 h-4 bg-green-500 rounded-full border-4 border-[var(--background-card)]" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-[var(--text-secondary)] bg-clip-text text-transparent">
                        {about.name}
                    </h1>
                    <p className="text-[var(--accent-primary)] font-medium mb-6 tracking-wide uppercase text-sm">
                      {about.title}
                    </p>

                    <div className="flex justify-center gap-3 mb-8">
                      {about.social_links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-[var(--accent-primary)]/20 hover:scale-110 transition-all border border-transparent hover:border-[var(--accent-primary)]/50"
                        >
                          {getIcon(link)}
                        </a>
                      ))}
                    </div>

                    <div className="space-y-4 text-left bg-white/5 dark:bg-black/20 p-4 rounded-xl border border-[var(--border-color)]">
                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                            <MapPin size={16} className="text-[var(--accent-secondary)]" />
                            <span>Indonesia based</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                            <Globe2 size={16} className="text-[var(--accent-secondary)]" />
                            <span>Open for Remote Work</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                             <Layers size={16} className="text-[var(--accent-secondary)]" />
                             <span>Full Stack GIS Dev</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleDownloadCV}
                        className="w-full mt-6 btn-glow py-3 text-sm tracking-wider uppercase font-semibold"
                    >
                        {about.cv_url ? "Download CV" : "CV Not Available"}
                    </button>

                    <a 
                        href="/print/portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-3 btn-secondary py-3 text-sm tracking-wider uppercase font-semibold text-center block"
                    >
                        📄 View Portfolio PDF
                    </a>
                 </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Scrollable Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* About Summary */}
            <motion.section 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">System Logs</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--accent-primary)] to-transparent" />
                </div>
                <div className="glass-card p-8 border-l-4 border-l-[var(--accent-primary)]">
                    <p className="font-mono text-[var(--accent-primary)] text-sm mb-4">{'>'} whoami</p>
                    <div className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed space-y-4">
                        {about.summary.split('\n\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Skills Hex Grid */}
            <motion.section
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">Tech Stack</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--accent-secondary)] to-transparent" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {about.skills.map((skillGroup, index) => (
                      <div key={index} className="glass-card p-6 hover:bg-white/5 transition-colors group">
                           <div className="flex items-center gap-3 mb-4">
                               <Cpu size={20} className="text-[var(--accent-secondary)] group-hover:animate-pulse" />
                               <h3 className="font-bold text-white uppercase tracking-wider text-sm">{skillGroup.category}</h3>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {skillGroup.items.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-default">
                                  {skill}
                                </span>
                              ))}
                           </div>
                      </div>
                   ))}
                </div>
            </motion.section>

            {/* Experience Metro Line */}
            <motion.section
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.3 }}
            >
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-white">Career Route</h2>
                     <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500 to-transparent" />
                </div>

                <div className="relative pl-4 space-y-12">
                   {/* Vertical Line */}
                   <div className="absolute left-[27px] top-2 bottom-0 w-[2px] bg-gradient-to-b from-[var(--accent-primary)] via-[var(--accent-secondary)] to-transparent opacity-30" />

                   {about.experience.map((exp, index) => (
                     <div key={index} className="relative pl-12 group">
                        {/* Node */}
                        <div className="absolute left-0 top-1 w-[56px] h-[56px] flex items-center justify-center bg-[var(--background-card)] border border-[var(--border-color)] rounded-2xl z-10 group-hover:border-[var(--accent-primary)] group-hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all">
                             <Briefcase size={24} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                        </div>

                        <div className="glass-card p-6 ml-4 border-l-4 border-l-transparent hover:border-l-[var(--accent-primary)] transition-all">
                             <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                 <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">{exp.role}</h3>
                                 <span className="text-xs font-mono text-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10 px-2 py-1 rounded">{exp.period}</span>
                             </div>
                             <p className="text-sm text-[var(--text-muted)] mb-4 flex items-center gap-2">
                                @ {exp.company}
                             </p>
                             <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {exp.description}
                             </p>
                        </div>
                     </div>
                   ))}
                </div>
            </motion.section>
            
            {/* Education */}
            <motion.section
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
            >
                 <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">Education</h2>
                     <div className="h-[1px] flex-1 bg-gradient-to-r from-green-500 to-transparent" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {about.education.map((edu, index) => (
                        <div key={index} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                                     <GraduationCap size={24} />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-white">{edu.degree}</h3>
                                     <p className="text-sm text-[var(--text-secondary)]">{edu.institution}</p>
                                 </div>
                             </div>
                             <span className="text-xs text-[var(--text-muted)] font-mono border border-white/10 px-3 py-1 rounded-full">
                                {edu.year}
                             </span>
                        </div>
                    ))}
                </div>
            </motion.section>

          </div>
        </div>
      </div>
      
      {/* Footer */}
       <footer className="py-8 text-center text-sm text-[var(--text-muted)] border-t border-white/5">
            <p>© {new Date().getFullYear()} Dhanypedia. System Status: Online.</p>
       </footer>
    </main>
  );
}
