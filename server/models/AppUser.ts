import mongoose, { Schema, type Document } from 'mongoose';

export interface CareerAnalysisDoc {
  id: string;
  sourceType?: 'quiz' | 'manual';
  careerRole: string;
  tagline: string;
  matchScore: number;
  emoji: string;
  whyThisFits: string;
  personalityType: string;
  traits: string[];
  roadmap: Array<{
    phase: number;
    title: string;
    duration: string;
    colorKey: string;
    skills: string[];
    milestone: string;
    resources: string[];
  }>;
  switchPaths: Array<{
    fromPhase: number;
    role: string;
    emoji: string;
    description: string;
    additionalSkills: string[];
  }>;
  topCompanies: string[];
  salaryRange: string;
  certifications: string[];
  createdAt: Date;
}

export interface AppUserDoc extends Document {
  clerkUserId: string;
  freeRequestsRemaining: number;
  hasCompletedFreeTrial: boolean;
  geminiApiKeyEncrypted?: string;
  careerHistory: CareerAnalysisDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapPhaseSchema = new Schema(
  {
    phase: { type: Number, required: true },
    title: { type: String, required: true },
    duration: { type: String, required: true },
    colorKey: { type: String, required: true },
    skills: { type: [String], required: true },
    milestone: { type: String, required: true },
    resources: { type: [String], required: true },
  },
  { _id: false },
);

const SwitchPathSchema = new Schema(
  {
    fromPhase: { type: Number, required: true },
    role: { type: String, required: true },
    emoji: { type: String, required: true },
    description: { type: String, required: true },
    additionalSkills: { type: [String], required: true },
  },
  { _id: false },
);

const CareerAnalysisSchema = new Schema(
  {
    id: { type: String, required: true },
    sourceType: { type: String, enum: ['quiz', 'manual'], required: false },
    careerRole: { type: String, required: true },
    tagline: { type: String, required: true },
    matchScore: { type: Number, required: true },
    emoji: { type: String, required: true },
    whyThisFits: { type: String, required: true },
    personalityType: { type: String, required: true },
    traits: { type: [String], required: true },
    roadmap: { type: [RoadmapPhaseSchema], required: true },
    switchPaths: { type: [SwitchPathSchema], required: true },
    topCompanies: { type: [String], required: true },
    salaryRange: { type: String, required: true },
    certifications: { type: [String], required: true },
    createdAt: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const AppUserSchema = new Schema<AppUserDoc>(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    freeRequestsRemaining: { type: Number, required: true, default: 1 },
    hasCompletedFreeTrial: { type: Boolean, required: true, default: false },
    geminiApiKeyEncrypted: { type: String, required: false },
    careerHistory: { type: [CareerAnalysisSchema], required: true, default: [] },
  },
  { timestamps: true },
);

export const AppUser =
  mongoose.models.AppUser ?? mongoose.model<AppUserDoc>('AppUser', AppUserSchema);
