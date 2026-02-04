'use client';

import { useState } from 'react';
import { JSONResume, ResumeVolunteer } from '@/types/resume';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface OrganizationalStepProps {
  data: JSONResume;
  updateData: <K extends keyof JSONResume>(key: K, value: JSONResume[K]) => void;
}

export function OrganizationalStep({ data, updateData }: OrganizationalStepProps) {
  const volunteer = data.volunteer || [];
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);

  const addVolunteer = () => {
    const newVol: ResumeVolunteer = {
      id: Date.now().toString(),
      organization: '',
      position: '',
      startDate: '',
      endDate: '',
      highlights: [''],
      location: '',
    };
    updateData('volunteer', [newVol, ...volunteer]);
    setExpandedItems([0]);
  };

  const updateVolunteer = (index: number, field: keyof ResumeVolunteer, value: unknown) => {
    const newVolunteer = [...volunteer];
    newVolunteer[index] = { ...newVolunteer[index], [field]: value };
    updateData('volunteer', newVolunteer);
  };

  const deleteVolunteer = (index: number) => {
    updateData('volunteer', volunteer.filter((_, i) => i !== index));
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleHighlightChange = (volIndex: number, highlightIndex: number, value: string) => {
    const vol = volunteer[volIndex];
    const newHighlights = [...(vol.highlights || [])];
    newHighlights[highlightIndex] = value;
    updateVolunteer(volIndex, 'highlights', newHighlights);
  };

  const addHighlight = (volIndex: number) => {
    const vol = volunteer[volIndex];
    updateVolunteer(volIndex, 'highlights', [...(vol.highlights || []), '']);
  };

  const removeHighlight = (volIndex: number, highlightIndex: number) => {
    const vol = volunteer[volIndex];
    const newHighlights = (vol.highlights || []).filter((_, i) => i !== highlightIndex);
    updateVolunteer(volIndex, 'highlights', newHighlights);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Organisational Experience 👥</h2>
        <p className="text-[var(--text-muted)] text-sm">
          Add volunteer work, student organizations, or community involvement.
        </p>
      </div>

      <div className="space-y-3">
        {volunteer.map((vol, index) => (
          <div key={vol.id || index} className="border border-[var(--border-primary)] rounded-lg bg-[var(--background-primary)]">
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="flex-1 cursor-pointer" onClick={() => toggleExpanded(index)}>
                <div className="font-medium text-[var(--text-primary)]">
                  {vol.organization || 'Organization Name'}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {vol.position || 'Role'} • {vol.startDate || 'Start'} - {vol.endDate || 'End'}
                </div>
              </div>
              <button onClick={() => toggleExpanded(index)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                {expandedItems.includes(index) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <button onClick={() => deleteVolunteer(index)} className="text-red-500 hover:text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Content */}
            {expandedItems.includes(index) && (
              <div className="px-4 pb-4 border-t border-[var(--border-primary)] pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Organization Name *</label>
                    <input
                      type="text"
                      value={vol.organization || ''}
                      onChange={(e) => updateVolunteer(index, 'organization', e.target.value)}
                      placeholder="KKN PPM UGM"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Role / Position *</label>
                    <input
                      type="text"
                      value={vol.position || ''}
                      onChange={(e) => updateVolunteer(index, 'position', e.target.value)}
                      placeholder="Koordinator Mahasiswa"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Location</label>
                    <input
                      type="text"
                      value={vol.location || ''}
                      onChange={(e) => updateVolunteer(index, 'location', e.target.value)}
                      placeholder="Lumajang, Jawa Timur"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Start Date</label>
                    <input
                      type="month"
                      value={vol.startDate || ''}
                      onChange={(e) => updateVolunteer(index, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">End Date</label>
                    <input
                      type="month"
                      value={vol.endDate || ''}
                      onChange={(e) => updateVolunteer(index, 'endDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                    />
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)]">Responsibilities / Achievements</label>
                  {(vol.highlights || []).map((highlight, hIndex) => (
                    <div key={hIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => handleHighlightChange(index, hIndex, e.target.value)}
                        placeholder="Describe your contribution..."
                        className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                      />
                      <button onClick={() => removeHighlight(index, hIndex)} className="px-2 text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addHighlight(index)} className="text-sm text-[var(--accent-primary)] hover:underline">
                    + Add responsibility
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addVolunteer}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--accent-primary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all"
      >
        <Plus className="w-5 h-5" />
        Add Organisation
      </button>
    </div>
  );
}
