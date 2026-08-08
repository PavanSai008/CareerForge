import type { CareerAnalysis } from '@/lib/api';

// Wouter has no location-state mechanism (unlike react-router's
// navigate(to, { state })), so the freshly generated analysis is handed off
// from the Quiz page to the Results page via sessionStorage. This also lets
// a page refresh on /results survive, and lets the History page reuse the
// same Results view for a past analysis.
const STORAGE_KEY = 'careerforge:activeCareerAnalysis';

export function setActiveCareerAnalysis(analysis: CareerAnalysis): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(analysis));
}

export function getActiveCareerAnalysis(): CareerAnalysis | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CareerAnalysis;
  } catch {
    return null;
  }
}

export function clearActiveCareerAnalysis(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
