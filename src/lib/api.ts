// Small, dependency-free API client + React Query hooks.
// Replaces the workspace-only `@workspace/api-client-react` package so this
// project has zero dependency on the Replit monorepo tooling and can be
// built/deployed standalone (local Node server or Vercel serverless).
//
// All requests are made with `credentials: "include"` and relative URLs
// (`/api/...`). In dev, Vite's proxy forwards `/api/*` to the local Express
// server so the browser sees everything as same-origin. In production on
// Vercel, the frontend and the `/api/*` serverless function are served from
// the same domain, so cookies (used by Clerk sessions) flow automatically
// without any CORS configuration.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export class ApiError<T = { error?: string }> extends Error {
  status: number;
  data: T;

  constructor(status: number, data: T, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });

  if (!res.ok) {
    let data: { error?: string; needsApiKey?: boolean } = {};
    try {
      data = await res.json();
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, data, data.error);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Types (hand-written equivalents of the generated OpenAPI/zod types)
// ---------------------------------------------------------------------------

export interface CareerAnswerInput {
  questionId: number;
  selectedOption: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  colorKey: string;
  skills: string[];
  milestone: string;
  resources: string[];
}

export interface SwitchPath {
  fromPhase: number;
  role: string;
  emoji: string;
  description: string;
  additionalSkills: string[];
}

export interface CareerAnalysis {
  id: string;
  sourceType?: 'quiz' | 'manual';
  careerRole: string;
  tagline: string;
  matchScore: number;
  emoji: string;
  whyThisFits: string;
  personalityType: string;
  traits: string[];
  roadmap: RoadmapPhase[];
  switchPaths: SwitchPath[];
  topCompanies: string[];
  salaryRange: string;
  certifications: string[];
  createdAt: string;
}

export interface ApiKeyStatus {
  hasApiKey: boolean;
  freeRequestsRemaining: number;
  hasCompletedFreeTrial: boolean;
}

// ---------------------------------------------------------------------------
// React Query hooks
// ---------------------------------------------------------------------------

export type AnalyzeCareerRequest =
  | { answers: CareerAnswerInput[] }
  | { prompt: string };

export function useAnalyzeCareer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { data: AnalyzeCareerRequest }) =>
      request<CareerAnalysis>('/api/career/analyze', {
        method: 'POST',
        body: JSON.stringify(vars.data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['career-history'] }),
  });
}

export function useListCareerHistory() {
  return useQuery({
    queryKey: ['career-history'],
    queryFn: () => request<CareerAnalysis[]>('/api/career/history'),
  });
}

export function useGetApiKeyStatus() {
  return useQuery({
    queryKey: ['api-key-status'],
    queryFn: () => request<ApiKeyStatus>('/api/account/api-key'),
  });
}

export function useUpdateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { data: { apiKey: string } }) =>
      request<ApiKeyStatus>('/api/account/api-key', {
        method: 'PUT',
        body: JSON.stringify(vars.data),
      }),
    onSuccess: (data) => qc.setQueryData(['api-key-status'], data),
  });
}

export function useDeleteApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => request<ApiKeyStatus>('/api/account/api-key', { method: 'DELETE' }),
    onSuccess: (data) => qc.setQueryData(['api-key-status'], data),
  });
}
