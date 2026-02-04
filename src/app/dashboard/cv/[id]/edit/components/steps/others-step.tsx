'use client';

import { useState } from 'react';
import { JSONResume, ResumeSkill, ResumeCertificate, ResumeLanguage } from '@/types/resume';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface OthersStepProps {
  data: JSONResume;
  updateData: <K extends keyof JSONResume>(key: K, value: JSONResume[K]) => void;
}

export function OthersStep({ data, updateData }: OthersStepProps) {
  const skills = data.skills || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];
  const [expandedSection, setExpandedSection] = useState<'skills' | 'certificates' | 'languages' | null>('skills');

  // Skills handlers
  const addSkill = () => {
    const newSkill: ResumeSkill = { name: '', level: '', keywords: [''] };
    updateData('skills', [newSkill, ...skills]);
  };

  const updateSkill = (index: number, field: keyof ResumeSkill, value: unknown) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    updateData('skills', newSkills);
  };

  const deleteSkill = (index: number) => {
    updateData('skills', skills.filter((_, i) => i !== index));
  };

  const updateKeyword = (skillIndex: number, keywordIndex: number, value: string) => {
    const skill = skills[skillIndex];
    const newKeywords = [...(skill.keywords || [])];
    newKeywords[keywordIndex] = value;
    updateSkill(skillIndex, 'keywords', newKeywords);
  };

  const addKeyword = (skillIndex: number) => {
    const skill = skills[skillIndex];
    updateSkill(skillIndex, 'keywords', [...(skill.keywords || []), '']);
  };

  const removeKeyword = (skillIndex: number, keywordIndex: number) => {
    const skill = skills[skillIndex];
    updateSkill(skillIndex, 'keywords', (skill.keywords || []).filter((_, i) => i !== keywordIndex));
  };

  // Certificates handlers
  const addCertificate = () => {
    const newCert: ResumeCertificate = { name: '', date: '', issuer: '' };
    updateData('certificates', [newCert, ...certificates]);
  };

  const updateCertificate = (index: number, field: keyof ResumeCertificate, value: string) => {
    const newCerts = [...certificates];
    newCerts[index] = { ...newCerts[index], [field]: value };
    updateData('certificates', newCerts);
  };

  const deleteCertificate = (index: number) => {
    updateData('certificates', certificates.filter((_, i) => i !== index));
  };

  // Languages handlers
  const addLanguage = () => {
    const newLang: ResumeLanguage = { language: '', fluency: '' };
    updateData('languages', [newLang, ...languages]);
  };

  const updateLanguage = (index: number, field: keyof ResumeLanguage, value: string) => {
    const newLangs = [...languages];
    newLangs[index] = { ...newLangs[index], [field]: value };
    updateData('languages', newLangs);
  };

  const deleteLanguage = (index: number) => {
    updateData('languages', languages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Skills, Certifications & Languages 🏆</h2>
        <p className="text-[var(--text-muted)] text-sm">Add your technical skills, certifications, and languages.</p>
      </div>

      {/* Skills Section */}
      <div className="border border-[var(--border-primary)] rounded-lg">
        <button
          onClick={() => setExpandedSection(expandedSection === 'skills' ? null : 'skills')}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="font-medium">Skills ({skills.length})</span>
          {expandedSection === 'skills' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSection === 'skills' && (
          <div className="px-4 pb-4 space-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="p-3 bg-[var(--background-secondary)] rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={skill.name || ''}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      placeholder="Skill Category (e.g., GIS & Mapping)"
                      className="px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] text-sm"
                    />
                    <select
                      value={skill.level || ''}
                      onChange={(e) => updateSkill(index, 'level', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] text-sm"
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <button onClick={() => deleteSkill(index)} className="text-red-500 hover:text-red-600 mt-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-[var(--text-muted)]">Keywords (specific technologies/tools)</label>
                  <div className="flex flex-wrap gap-2">
                    {(skill.keywords || []).map((keyword, kIndex) => (
                      <div key={kIndex} className="flex items-center gap-1 bg-[var(--background-primary)] rounded px-2 py-1 border border-[var(--border-primary)]">
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => updateKeyword(index, kIndex, e.target.value)}
                          placeholder="Keyword"
                          className="w-24 bg-transparent text-sm outline-none"
                        />
                        <button onClick={() => removeKeyword(index, kIndex)} className="text-red-500">×</button>
                      </div>
                    ))}
                    <button onClick={() => addKeyword(index)} className="text-sm text-[var(--accent-primary)] hover:underline">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addSkill} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--accent-primary)] hover:underline">
              <Plus className="w-4 h-4" /> Add Skill Category
            </button>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div className="border border-[var(--border-primary)] rounded-lg">
        <button
          onClick={() => setExpandedSection(expandedSection === 'certificates' ? null : 'certificates')}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="font-medium">Certifications ({certificates.length})</span>
          {expandedSection === 'certificates' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSection === 'certificates' && (
          <div className="px-4 pb-4 space-y-3">
            {certificates.map((cert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[var(--background-secondary)] rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={cert.name || ''}
                    onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                    placeholder="Certificate Name"
                    className="px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] text-sm"
                  />
                  <input
                    type="text"
                    value={cert.issuer || ''}
                    onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                    placeholder="Issuing Organization"
                    className="px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] text-sm"
                  />
                  <input
                    type="text"
                    value={cert.date || ''}
                    onChange={(e) => updateCertificate(index, 'date', e.target.value)}
                    placeholder="Year (e.g., 2022)"
                    className="px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] text-sm"
                  />
                </div>
                <button onClick={() => deleteCertificate(index)} className="text-red-500 hover:text-red-600 mt-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addCertificate} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--accent-primary)] hover:underline">
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="border border-[var(--border-primary)] rounded-lg">
        <button
          onClick={() => setExpandedSection(expandedSection === 'languages' ? null : 'languages')}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="font-medium">Languages ({languages.length})</span>
          {expandedSection === 'languages' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSection === 'languages' && (
          <div className="px-4 pb-4 space-y-3">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-[var(--background-secondary)] rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={lang.language || ''}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    placeholder="Language (e.g., Indonesian)"
                    className="px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] text-sm"
                  />
                  <select
                    value={lang.fluency || ''}
                    onChange={(e) => updateLanguage(index, 'fluency', e.target.value)}
                    className="px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] text-sm"
                  >
                    <option value="">Select fluency</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Professional Working">Professional Working</option>
                    <option value="Limited Working">Limited Working</option>
                    <option value="Elementary">Elementary</option>
                  </select>
                </div>
                <button onClick={() => deleteLanguage(index)} className="text-red-500 hover:text-red-600 mt-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addLanguage} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--accent-primary)] hover:underline">
              <Plus className="w-4 h-4" /> Add Language
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
