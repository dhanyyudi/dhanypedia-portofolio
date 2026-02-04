'use client';

import { useState } from 'react';
import { JSONResume, ResumeEducation } from '@/types/resume';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface EducationStepProps {
  data: JSONResume;
  updateData: <K extends keyof JSONResume>(key: K, value: JSONResume[K]) => void;
}

export function EducationStep({ data, updateData }: EducationStepProps) {
  const education = data.education || [];
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: Date.now().toString(),
      institution: '',
      area: '',
      studyType: '',
      startDate: '',
      endDate: '',
      score: '',
      highlights: [''],
      location: '',
    };
    updateData('education', [newEdu, ...education]);
    setExpandedItems([0]);
  };

  const updateEducation = (index: number, field: keyof ResumeEducation, value: unknown) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    updateData('education', newEducation);
  };

  const deleteEducation = (index: number) => {
    updateData('education', education.filter((_, i) => i !== index));
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleHighlightChange = (eduIndex: number, highlightIndex: number, value: string) => {
    const edu = education[eduIndex];
    const newHighlights = [...(edu.highlights || [])];
    newHighlights[highlightIndex] = value;
    updateEducation(eduIndex, 'highlights', newHighlights);
  };

  const addHighlight = (eduIndex: number) => {
    const edu = education[eduIndex];
    updateEducation(eduIndex, 'highlights', [...(edu.highlights || []), '']);
  };

  const removeHighlight = (eduIndex: number, highlightIndex: number) => {
    const edu = education[eduIndex];
    const newHighlights = (edu.highlights || []).filter((_, i) => i !== highlightIndex);
    updateEducation(eduIndex, 'highlights', newHighlights);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Education 🎓</h2>
        <p className="text-[var(--text-muted)] text-sm">Add your educational background, starting with the most recent.</p>
      </div>

      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={edu.id || index} className="border border-[var(--border-primary)] rounded-lg bg-[var(--background-primary)]">
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="flex-1 cursor-pointer" onClick={() => toggleExpanded(index)}>
                <div className="font-medium text-[var(--text-primary)]">
                  {edu.institution || 'Institution Name'}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {edu.studyType || 'Degree'} in {edu.area || 'Field of Study'} • {edu.startDate || 'Start'} - {edu.endDate || 'End'}
                </div>
              </div>
              <button onClick={() => toggleExpanded(index)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                {expandedItems.includes(index) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <button onClick={() => deleteEducation(index)} className="text-red-500 hover:text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Content */}
            {expandedItems.includes(index) && (
              <div className="px-4 pb-4 border-t border-[var(--border-primary)] pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Institution *</label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="Universitas Gadjah Mada"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Location</label>
                    <input
                      type="text"
                      value={edu.location || ''}
                      onChange={(e) => updateEducation(index, 'location', e.target.value)}
                      placeholder="Yogyakarta, Indonesia"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Degree Type *</label>
                    <select
                      value={edu.studyType || ''}
                      onChange={(e) => updateEducation(index, 'studyType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    >
                      <option value="">Select degree type</option>
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                      <option value="PhD">PhD</option>
                      <option value="Certificate">Certificate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Field of Study *</label>
                    <input
                      type="text"
                      value={edu.area || ''}
                      onChange={(e) => updateEducation(index, 'area', e.target.value)}
                      placeholder="Survey and Mapping"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Start Date</label>
                    <input
                      type="month"
                      value={edu.startDate || ''}
                      onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">End Date / Expected</label>
                    <input
                      type="month"
                      value={edu.endDate || ''}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">GPA / Score</label>
                    <input
                      type="text"
                      value={edu.score || ''}
                      onChange={(e) => updateEducation(index, 'score', e.target.value)}
                      placeholder="3.90/4.00"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)]">Achievements / Activities</label>
                  {(edu.highlights || []).map((highlight, hIndex) => (
                    <div key={hIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleHighlightChange(index, hIndex, e.target.value)}
                        placeholder="Awards, publications, relevant coursework..."
                        className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                      />
                      <button onClick={() => removeHighlight(index, hIndex)} className="px-2 text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addHighlight(index)} className="text-sm text-[var(--accent-primary)] hover:underline">
                    + Add achievement
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addEducation}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--accent-primary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all"
      >
        <Plus className="w-5 h-5" />
        Add Education
      </button>
    </div>
  );
}
