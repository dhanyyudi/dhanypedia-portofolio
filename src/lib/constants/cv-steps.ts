// CV Builder Step Configuration
// Following Kinobi's 6-step wizard pattern

import { User, Briefcase, GraduationCap, Users, Award, CheckCircle, LucideIcon } from 'lucide-react';

export const CV_STEPS = [
  { id: 1, key: 'personal', label: 'Personal Information', icon: 'User' },
  { id: 2, key: 'professional', label: 'Professional', icon: 'Briefcase' },
  { id: 3, key: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 4, key: 'organizational', label: 'Organisational', icon: 'Users' },
  { id: 5, key: 'others', label: 'Others', icon: 'Award' },
  { id: 6, key: 'review', label: 'Review', icon: 'CheckCircle' },
] as const;

export type CVStepKey = typeof CV_STEPS[number]['key'];
export type CVStepId = typeof CV_STEPS[number]['id'];

export const STEP_ICONS: Record<string, LucideIcon> = {
  User,
  Briefcase,
  GraduationCap,
  Users,
  Award,
  CheckCircle,
};

// Helper to get step by key
export function getStepByKey(key: CVStepKey) {
  return CV_STEPS.find(step => step.key === key);
}

// Helper to get step by id
export function getStepById(id: CVStepId) {
  return CV_STEPS.find(step => step.id === id);
}
