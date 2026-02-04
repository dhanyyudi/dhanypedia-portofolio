'use client';

import { useState } from 'react';
import { JSONResume, ResumeWork } from '@/types/resume';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, ChevronDown, ChevronUp, Trash2, Lightbulb } from 'lucide-react';

interface ProfessionalStepProps {
  data: JSONResume;
  updateData: <K extends keyof JSONResume>(key: K, value: JSONResume[K]) => void;
}

interface SortableWorkItemProps {
  work: ResumeWork;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (field: keyof ResumeWork, value: unknown) => void;
  onDelete: () => void;
}

function SortableWorkItem({ work, index, isExpanded, onToggle, onChange, onDelete }: SortableWorkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: work.id || index.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const handleHighlightChange = (highlightIndex: number, value: string) => {
    const newHighlights = [...(work.highlights || [])];
    newHighlights[highlightIndex] = value;
    onChange('highlights', newHighlights);
  };

  const addHighlight = () => {
    onChange('highlights', [...(work.highlights || []), '']);
  };

  const removeHighlight = (highlightIndex: number) => {
    const newHighlights = (work.highlights || []).filter((_, i) => i !== highlightIndex);
    onChange('highlights', newHighlights);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-[var(--border-primary)] rounded-lg bg-[var(--background-primary)] ${isDragging ? 'shadow-lg opacity-80' : ''}`}
    >
      {/* Header - Always visible */}
      <div className="flex items-center gap-3 p-4">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
          <GripVertical className="w-5 h-5" />
        </button>
        
        <div className="flex-1" onClick={onToggle}>
          <div className="font-medium text-[var(--text-primary)]">
            {work.name || 'Company Name'}
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            {work.position || 'Position'} • {work.startDate || 'Start'} - {work.isCurrentRole ? 'Present' : work.endDate || 'End'}
          </div>
        </div>

        <button onClick={onToggle} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        <button onClick={onDelete} className="text-red-500 hover:text-red-600">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-[var(--border-primary)] pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Company Name *</label>
              <input
                type="text"
                value={work.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                placeholder="SWAT Mobility"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Position *</label>
              <input
                type="text"
                value={work.position || ''}
                onChange={(e) => onChange('position', e.target.value)}
                placeholder="Associate Cartography Engineer"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Location</label>
              <input
                type="text"
                value={work.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                placeholder="Singapore"
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Start Date *</label>
              <input
                type="month"
                value={work.startDate || ''}
                onChange={(e) => onChange('startDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={work.isCurrentRole || false}
                  onChange={(e) => onChange('isCurrentRole', e.target.checked)}
                  className="rounded border-[var(--border-primary)]"
                />
                <span className="text-[var(--text-secondary)]">I currently work here</span>
              </label>
            </div>
            {!work.isCurrentRole && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">End Date</label>
                <input
                  type="month"
                  value={work.endDate || ''}
                  onChange={(e) => onChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">Company Description (optional)</label>
            <textarea
              value={work.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Brief description of the company..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm resize-none"
            />
          </div>

          {/* Key Achievements */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">Key Achievements / Responsibilities</label>
            {(work.highlights || []).map((highlight, hIndex) => (
              <div key={hIndex} className="flex gap-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => handleHighlightChange(hIndex, e.target.value)}
                  placeholder="Start with action verb: Managed, Developed, Led..."
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--background-primary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] text-sm"
                />
                <button
                  onClick={() => removeHighlight(hIndex)}
                  className="px-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addHighlight}
              className="text-sm text-[var(--accent-primary)] hover:underline"
            >
              + Add achievement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProfessionalStep({ data, updateData }: ProfessionalStepProps) {
  const work = data.work || [];
  const [expandedItems, setExpandedItems] = useState<number[]>([0]);
  const [showTips, setShowTips] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = work.findIndex((w, i) => (w.id || i.toString()) === active.id);
      const newIndex = work.findIndex((w, i) => (w.id || i.toString()) === over.id);
      updateData('work', arrayMove(work, oldIndex, newIndex));
    }
  };

  const addWork = () => {
    const newWork: ResumeWork = {
      id: Date.now().toString(),
      name: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      highlights: [''],
    };
    updateData('work', [newWork, ...work]);
    setExpandedItems([0]);
  };

  const updateWork = (index: number, field: keyof ResumeWork, value: unknown) => {
    const newWork = [...work];
    newWork[index] = { ...newWork[index], [field]: value };
    updateData('work', newWork);
  };

  const deleteWork = (index: number) => {
    updateData('work', work.filter((_, i) => i !== index));
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Work Experiences ✏️</h2>
          <p className="text-[var(--text-muted)] text-sm">Start with your most recent (newest) experiences.</p>
        </div>
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--background-secondary)] text-sm"
        >
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          TIPS
        </button>
      </div>

      {/* Tips Panel */}
      {showTips && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">💡 Work Experience Tips</h4>
          <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>Start each bullet point with an action verb (Managed, Developed, Led, etc.)</li>
            <li>Include quantifiable achievements when possible (%, numbers, $)</li>
            <li>Focus on impact and results, not just responsibilities</li>
            <li>Keep each bullet point to 1-2 lines for readability</li>
          </ul>
        </div>
      )}

      {/* Work Items */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={work.map((w, i) => w.id || i.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {work.map((workItem, index) => (
              <SortableWorkItem
                key={workItem.id || index}
                work={workItem}
                index={index}
                isExpanded={expandedItems.includes(index)}
                onToggle={() => toggleExpanded(index)}
                onChange={(field, value) => updateWork(index, field, value)}
                onDelete={() => deleteWork(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Button */}
      <button
        onClick={addWork}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-[var(--border-primary)] hover:border-[var(--accent-primary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all"
      >
        <Plus className="w-5 h-5" />
        Add Work Experience
      </button>
    </div>
  );
}
