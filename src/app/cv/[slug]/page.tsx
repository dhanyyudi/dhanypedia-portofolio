import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { Resume } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Code } from 'lucide-react';
import { PrintButton } from './print-button';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicCVPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (error || !data) {
    notFound();
  }

  const resume = data as Resume;
  const { basics, work, education, skills } = resume.content;

  return (
    <main className="min-h-screen bg-white text-slate-900 print:bg-white" data-theme="light">
      <div className="max-w-3xl mx-auto px-8 py-12 print:p-0">
        {/* Header */}
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{basics?.name}</h1>
          {basics?.label && (
            <p className="text-lg text-blue-600 font-medium">{basics.label}</p>
          )}
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            {basics?.email && (
              <span className="flex items-center gap-1">
                <Mail size={14} /> {basics.email}
              </span>
            )}
            {basics?.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} /> {basics.phone}
              </span>
            )}
            {basics?.location?.city && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {basics.location.city}
              </span>
            )}
            {basics?.url && (
              <a href={basics.url} className="flex items-center gap-1 text-blue-600 hover:underline">
                <Globe size={14} /> Portfolio
              </a>
            )}
          </div>
        </header>

        {/* Summary */}
        {basics?.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 uppercase tracking-wide">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{basics.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {work && work.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Briefcase size={18} /> Experience
            </h2>
            <div className="space-y-4">
              {work.map((job, i) => (
                <div key={i} className="border-l-2 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.position}</h3>
                      <p className="text-blue-600">{job.name}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {job.startDate} - {job.endDate || 'Present'}
                    </span>
                  </div>
                  {job.summary && (
                    <p className="text-gray-700 text-sm mt-2">{job.summary}</p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                      {job.highlights.map((h, j) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
              <GraduationCap size={18} /> Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="border-l-2 border-green-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.studyType} in {edu.area}</h3>
                      <p className="text-green-600">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Code size={18} /> Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  {skill.name}
                  {skill.level && <span className="text-gray-500 ml-1">({skill.level})</span>}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Print Button (hidden in print) */}
        <div className="mt-8 text-center print:hidden">
          <PrintButton />
        </div>
      </div>
    </main>
  );
}
