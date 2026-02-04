'use client';

import { useState } from 'react';
import { JSONResume } from '@/types/resume';
import { CircleCheck, CircleX, Lightbulb, X, ChevronRight } from 'lucide-react';

interface ATSScoreBadgeProps {
  data: JSONResume;
  showDetails?: boolean;
}

interface ScoreCategory {
  name: string;
  maxPoints: number;
  score: number;
  suggestions: string[];
}

export function calculateATSScore(data: JSONResume): { total: number; categories: ScoreCategory[] } {
  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const skills = data.skills || [];

  const categories: ScoreCategory[] = [];

  // Contact Information (20 points)
  let contactScore = 0;
  const contactSuggestions: string[] = [];
  if (basics.name && basics.name.length >= 2) contactScore += 5;
  else contactSuggestions.push('Add your full name');
  if (basics.email) contactScore += 5;
  else contactSuggestions.push('Add your email address');
  if (basics.phone) contactScore += 5;
  else contactSuggestions.push('Add your phone number');
  if (basics.location?.city) contactScore += 3;
  else contactSuggestions.push('Add your city/location');
  if (basics.profiles?.some(p => p.network === 'LinkedIn')) contactScore += 2;
  else contactSuggestions.push('Add your LinkedIn profile');
  categories.push({ name: 'Contact Information', maxPoints: 20, score: contactScore, suggestions: contactSuggestions });

  // Professional Summary (15 points)
  let summaryScore = 0;
  const summarySuggestions: string[] = [];
  if (basics.summary) {
    const length = basics.summary.length;
    if (length >= 150) summaryScore = 15;
    else if (length >= 100) summaryScore = 12;
    else if (length >= 50) summaryScore = 8;
    else summaryScore = 4;
    if (length < 100) summarySuggestions.push('Expand your summary to 100-200 characters');
  } else {
    summarySuggestions.push('Add a professional summary (2-3 sentences)');
  }
  categories.push({ name: 'Professional Summary', maxPoints: 15, score: summaryScore, suggestions: summarySuggestions });

  // Work Experience (30 points)
  let workScore = 0;
  const workSuggestions: string[] = [];
  if (work.length >= 3) workScore += 10;
  else if (work.length >= 2) workScore += 8;
  else if (work.length >= 1) workScore += 5;
  else workSuggestions.push('Add at least 2-3 work experiences');

  const workWithHighlights = work.filter(w => w.highlights && w.highlights.filter(h => h).length >= 2);
  if (workWithHighlights.length >= 2) workScore += 15;
  else if (workWithHighlights.length >= 1) workScore += 10;
  else workSuggestions.push('Add 2-3 achievements per work experience');

  const workWithDates = work.filter(w => w.startDate);
  if (workWithDates.length === work.length && work.length > 0) workScore += 5;
  else if (work.length > 0) workSuggestions.push('Add dates to all work experiences');
  categories.push({ name: 'Work Experience', maxPoints: 30, score: workScore, suggestions: workSuggestions });

  // Education (15 points)
  let educationScore = 0;
  const educationSuggestions: string[] = [];
  if (education.length >= 1) {
    educationScore += 10;
    const hasComplete = education.some(e => e.institution && e.studyType && e.area);
    if (hasComplete) educationScore += 5;
    else educationSuggestions.push('Complete institution, degree type, and field of study');
  } else {
    educationSuggestions.push('Add your education background');
  }
  categories.push({ name: 'Education', maxPoints: 15, score: educationScore, suggestions: educationSuggestions });

  // Skills (20 points)
  let skillsScore = 0;
  const skillsSuggestions: string[] = [];
  if (skills.length >= 4) skillsScore += 10;
  else if (skills.length >= 2) skillsScore += 7;
  else if (skills.length >= 1) skillsScore += 4;
  else skillsSuggestions.push('Add at least 3-4 skill categories');

  const skillsWithKeywords = skills.filter(s => s.keywords && s.keywords.length >= 3);
  if (skillsWithKeywords.length >= 3) skillsScore += 10;
  else if (skillsWithKeywords.length >= 1) skillsScore += 5;
  else if (skills.length > 0) skillsSuggestions.push('Add 3+ keywords per skill category');
  categories.push({ name: 'Skills', maxPoints: 20, score: skillsScore, suggestions: skillsSuggestions });

  const total = categories.reduce((sum, cat) => sum + cat.score, 0);

  return { total, categories };
}

export function ATSScoreBadge({ data, showDetails = true }: ATSScoreBadgeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { total, categories } = calculateATSScore(data);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  const allSuggestions = categories.flatMap(c => c.suggestions);

  return (
    <>
      <div
        onClick={() => showDetails && setIsDialogOpen(true)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getScoreBg(total)}`}
      >
        <div className={`text-3xl font-bold ${getScoreColor(total)}`}>{total}</div>
        <div>
          <div className="font-medium text-[var(--text-primary)]">ATS Score</div>
          <div className="text-sm text-[var(--text-muted)]">{getScoreLabel(total)}</div>
        </div>
        {showDetails && allSuggestions.length > 0 && (
          <div className="ml-auto flex items-center gap-1 text-[var(--accent-primary)]">
            <Lightbulb className="w-4 h-4" />
            <span className="text-sm">{allSuggestions.length} tips</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Suggestions Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[var(--background-primary)] rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
              <h3 className="text-lg font-semibold">ATS Score Breakdown</h3>
              <button onClick={() => setIsDialogOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[60vh] space-y-4">
              {categories.map((cat, i) => (
                <div key={i} className="border border-[var(--border-primary)] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className={`font-bold ${cat.score === cat.maxPoints ? 'text-green-500' : 'text-yellow-500'}`}>
                      {cat.score}/{cat.maxPoints}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all ${cat.score === cat.maxPoints ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${(cat.score / cat.maxPoints) * 100}%` }}
                    />
                  </div>

                  {cat.suggestions.length > 0 ? (
                    <ul className="space-y-1">
                      {cat.suggestions.map((suggestion, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                          <CircleX className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CircleCheck className="w-4 h-4" />
                      All checks passed!
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-primary)] bg-[var(--background-secondary)]">
              <p className="text-sm text-[var(--text-muted)]">
                💡 Tip: A score of 80+ is typically sufficient to pass most ATS systems.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
