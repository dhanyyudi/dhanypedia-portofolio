'use client';

import { JSONResume } from '@/types/resume';
import { ExternalLink } from 'lucide-react';
import { ATSScoreBadge } from '@/components/cv-editor/ats-score-badge';
import { PDFDownloadButton } from '@/components/cv-editor/pdf-download-button';

interface ReviewStepProps {
  data: JSONResume;
  isPublic: boolean;
  onTogglePublic: () => void;
  slug: string;
  resumeId: string;
  resumeTitle: string;
}

export function ReviewStep({ data, isPublic, onTogglePublic, slug, resumeId, resumeTitle }: ReviewStepProps) {
  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const volunteer = data.volunteer || [];
  const skills = data.skills || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your CV ✅</h2>
        <p className="text-[var(--text-muted)] text-sm">Preview your resume and adjust visibility settings.</p>
      </div>

      {/* ATS Score Badge - Now with detailed breakdown */}
      <ATSScoreBadge data={data} showDetails={true} />

      {/* Visibility Toggle */}
      <div className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-[var(--text-primary)]">Public Visibility</div>
            <div className="text-sm text-[var(--text-muted)]">
              {isPublic ? 'Anyone with the link can view your CV' : 'Only you can view this CV'}
            </div>
          </div>
          <button
            onClick={onTogglePublic}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPublic ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {isPublic && (
          <div className="mt-3 pt-3 border-t border-[var(--border-primary)]">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-muted)]">Public URL:</span>
              <a
                href={`/cv/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] hover:underline flex items-center gap-1"
              >
                /cv/{slug}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Quick Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--background-secondary)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{work.length}</div>
          <div className="text-sm text-[var(--text-muted)]">Work Experiences</div>
        </div>
        <div className="bg-[var(--background-secondary)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{education.length}</div>
          <div className="text-sm text-[var(--text-muted)]">Education</div>
        </div>
        <div className="bg-[var(--background-secondary)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{volunteer.length}</div>
          <div className="text-sm text-[var(--text-muted)]">Organizations</div>
        </div>
        <div className="bg-[var(--background-secondary)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{skills.length}</div>
          <div className="text-sm text-[var(--text-muted)]">Skill Categories</div>
        </div>
      </div>

      {/* PDF Download Section */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Download Your Resume</h3>
            <p className="text-sm text-[var(--text-muted)]">
              Get a professional PDF version ready for job applications
            </p>
          </div>
          <PDFDownloadButton resumeId={resumeId} resumeTitle={resumeTitle} />
        </div>
      </div>

      {/* Mini Preview */}
      <div className="border border-[var(--border-primary)] rounded-lg overflow-hidden">
        <div className="bg-[var(--background-secondary)] px-4 py-3 border-b border-[var(--border-primary)] flex items-center justify-between">
          <span className="font-medium">Quick Preview</span>
          <a
            href={`/cv/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--accent-primary)] hover:underline flex items-center gap-1"
          >
            Open Full View
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 max-w-2xl mx-auto text-sm">
            <div className="border-b-2 border-gray-800 dark:border-gray-200 pb-3 mb-4">
              <h1 className="text-xl font-bold uppercase tracking-wide text-gray-900 dark:text-white">
                {basics.name || 'Your Name'}
              </h1>
              {basics.label && (
                <div className="text-sm text-gray-600 dark:text-gray-400">{basics.label}</div>
              )}
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                {basics.phone && <span>{basics.phone}</span>}
                {basics.email && <span className="text-blue-600">| {basics.email}</span>}
              </div>
            </div>

            {work.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-bold border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">Work Experiences</h2>
                {work.slice(0, 2).map((job, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-xs">{job.name}</span>
                      <span className="text-xs text-gray-500">{job.startDate}</span>
                    </div>
                    <div className="text-xs italic text-gray-600 dark:text-gray-400">{job.position}</div>
                  </div>
                ))}
                {work.length > 2 && (
                  <p className="text-xs text-gray-400">+ {work.length - 2} more...</p>
                )}
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
