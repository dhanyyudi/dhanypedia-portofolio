'use client';

import { useState } from 'react';
import { JSONResume } from '@/types/resume';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';

interface CVLivePreviewProps {
  data: JSONResume;
  isOpen: boolean;
  onClose: () => void;
}

export function CVLivePreview({ data, isOpen, onClose }: CVLivePreviewProps) {
  const [scale, setScale] = useState(0.6);

  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const volunteer = data.volunteer || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];
  const projects = data.projects || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex">
      {/* Preview Panel */}
      <div className="flex-1 flex flex-col bg-gray-800 overflow-hidden">
        {/* Header Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <span className="text-white font-medium">Live Preview (Modern Professional)</span>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-2 py-1">
              <button onClick={() => setScale(s => Math.max(0.3, s - 0.1))} className="text-gray-300 hover:text-white">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-gray-300 text-sm min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(s => Math.min(1, s + 0.1))} className="text-gray-300 hover:text-white">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-gray-600">
          <div
            className="bg-white shadow-2xl origin-top transition-transform text-slate-900"
            style={{
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${scale})`,
              padding: '20mm',
              fontSize: '11px', 
              fontFamily: 'sans-serif'
            }}
          >
            {/* HEADER */}
            <div className="flex flex-row items-center gap-5 border-b border-slate-300 pb-5 mb-6">
              {basics.image && (
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0">
                  <img src={basics.image} className="w-full h-full object-cover" alt="Profile" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900 leading-tight mb-2">
                  {basics.name}
                </h1>
                <p className="text-base font-medium text-blue-500 uppercase tracking-wide leading-snug">
                  {basics.label}
                </p>
              </div>
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="flex flex-row gap-5">
              
              {/* LEFT COLUMN (30%) */}
              <div className="w-[30%] flex flex-col gap-6">
                
                {/* CONTACT */}
                <section>
                  <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                    Contact
                  </h3>
                  <div className="flex flex-col gap-2 text-xs text-blue-600">
                    {basics.email && <span>{basics.email}</span>}
                    {basics.phone && <span className="text-slate-700">{basics.phone}</span>}
                    {basics.location && (
                      <span className="text-slate-700">
                        {basics.location.city}, {basics.location.countryCode}
                      </span>
                    )}
                    {basics.url && <a href={basics.url} className="underline decoration-blue-300" target="_blank" rel="noopener noreferrer">Portfolio</a>}
                    {basics.profiles?.map(p => (
                      <a key={p.network} href={p.url} className="underline decoration-blue-300" target="_blank" rel="noopener noreferrer">
                        {p.network}
                      </a>
                    ))}
                  </div>
                </section>

                {/* EDUCATION */}
                {education.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Education
                    </h3>
                    <div className="flex flex-col gap-3">
                      {education.map((edu, i) => (
                        <div key={i}>
                          <div className="font-bold text-slate-900 text-xs">{edu.area}</div>
                          <div className="text-slate-700 text-xs">{edu.institution}</div>
                          <div className="text-slate-500 text-[10px] my-0.5">
                            {edu.startDate} – {edu.endDate}
                          </div>
                          {edu.score && <div className="text-slate-600 text-[10px]">GPA: {edu.score}</div>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* SKILLS */}
                {skills.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Skills
                    </h3>
                    <div className="flex flex-col gap-3">
                      {skills.map((skill, i) => (
                        <div key={i}>
                          <div className="font-bold text-slate-900 text-[10px] mb-1">{skill.name}</div>
                          <div className="text-slate-600 text-[10px] leading-relaxed">
                            {skill.keywords?.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                 {/* LANGUAGES */}
                 {languages.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Languages
                    </h3>
                    <div className="flex flex-col gap-1">
                      {languages.map((lang, i) => (
                        <div key={i} className="text-xs">
                          <span className="font-medium text-slate-900">{lang.language}</span>
                          <span className="text-slate-500"> - {lang.fluency}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* CERTIFICATIONS */}
                {certificates.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Certificates
                    </h3>
                    <div className="flex flex-col gap-2">
                      {certificates.map((cert, i) => (
                        <div key={i} className="text-[10px]">
                           <span className="font-bold text-slate-900">{cert.name}</span>
                           <div className="text-slate-500">{cert.issuer} ({cert.date})</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN (70%) */}
              <div className="w-[70%] flex flex-col gap-6">
                
                {/* SUMMARY */}
                {basics.summary && (
                  <section>
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Summary
                    </h3>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {basics.summary}
                    </p>
                  </section>
                )}

                {/* EXPERIENCE */}
                {work.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Experience
                    </h3>
                    <div className="flex flex-col gap-4">
                      {work.map((job, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline mb-1">
                            <div className="text-sm font-bold text-slate-900">{job.position}</div>
                            <div className="text-slate-500 text-[10px] whitespace-nowrap">
                              {job.startDate} – {job.isCurrentRole ? 'Present' : job.endDate}
                            </div>
                          </div>
                          <div className="text-blue-600 font-medium text-xs mb-1">
                            {job.name}
                            {job.location && <span className="text-slate-400 font-normal"> | {job.location}</span>}
                          </div>
                          
                          {job.description && (
                            <div className="text-slate-600 text-[10px] mb-2 italic">
                              {job.description}
                            </div>
                          )}

                          {job.highlights && job.highlights.length > 0 && (
                            <ul className="list-disc ml-4 space-y-1">
                              {job.highlights.map((h, idx) => (
                                <li key={idx} className="text-slate-700 text-[10px] leading-relaxed pl-1">
                                  {h}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* PROJECTS */}
                {projects.length > 0 && (
                  <section>
                    <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Projects
                    </h3>
                    <div className="flex flex-col gap-4">
                      {projects.map((proj, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline mb-1">
                             <div className="text-sm font-bold text-slate-900">{proj.name}</div>
                             <div className="text-slate-500 text-[10px]">
                               {proj.startDate} – {proj.endDate}
                             </div>
                          </div>
                          <div className="text-blue-600 text-xs mb-1 font-medium">{proj.description}</div>
                          {proj.highlights && (
                            <ul className="list-disc ml-4 space-y-0.5">
                              {proj.highlights.map((h, idx) => (
                                <li key={idx} className="text-slate-700 text-[10px]">{h}</li>
                              ))}
                            </ul>
                          )}
                          {proj.keywords && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {proj.keywords.map((k, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] border border-slate-200">
                                  {k}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                {/* VOLUNTEER */}
                {volunteer.length > 0 && (
                  <section>
                     <h3 className="font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3 text-xs">
                      Volunteering
                    </h3>
                    <div className="flex flex-col gap-3">
                      {volunteer.map((vol, i) => (
                         <div key={i}>
                            <div className="flex justify-between">
                              <div className="text-sm font-bold text-slate-900">{vol.position}</div>
                              <div className="text-slate-500 text-[10px]">{vol.startDate} – {vol.endDate}</div>
                            </div>
                            <div className="text-blue-600 text-xs">{vol.organization}</div>
                            {vol.highlights && (
                               <ul className="list-disc ml-4 mt-1 space-y-0.5">
                                {vol.highlights.map((h, idx) => (
                                  <li key={idx} className="text-slate-700 text-[10px]">{h}</li>
                                ))}
                              </ul>
                            )}
                         </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
