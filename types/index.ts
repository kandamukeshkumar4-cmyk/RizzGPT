// ─── User / Auth ─────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

// ─── Usage / Rate Limiting ────────────────────────────────────────────────────
export interface UsageRecord {
  id: string;
  user_id: string;
  feature: Feature;
  model_used: string;
  created_at: string;
}

export type Feature = 'chat' | 'profile_writer' | 'profile_review' | 'ai_photos';

export interface UsageSummary {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string; // ISO date string (midnight tonight)
}

// ─── Chat Assistant ───────────────────────────────────────────────────────────
export type Tone = 'flirty' | 'funny' | 'friendly' | 'formal';

export interface ChatRequest {
  inputText?: string;
  inputImageBase64?: string; // base64 encoded screenshot
  tone: Tone;
}

export interface ChatResponse {
  replies: string[];
  model: string;
  usage: UsageSummary;
}

// ─── Profile Writer ───────────────────────────────────────────────────────────
export type Platform = 'tinder' | 'bumble' | 'hinge' | 'hinge' | 'coffee_meets_bagel' | 'other';

export interface ProfileWriterAnswers {
  occupation: string;
  hobbies: string;
  humor: string;
  lookingFor: string;
  unique: string;
  funFact: string;
  age?: string;
  height?: string;
}

export interface ProfileWriterRequest {
  platform: Platform;
  answers: ProfileWriterAnswers;
}

export interface ProfileWriterResponse {
  bios: string[];
  model: string;
  usage: UsageSummary;
}

// ─── Profile Review ───────────────────────────────────────────────────────────
export interface ProfileScore {
  overall: number;   // 0-100
  photos: number;
  bio: number;
  prompts: number;
}

export interface ProfileFeedback {
  redFlags: string[];
  strengths: string[];
  recommendations: string[];
  photoTips: string[];
  bioTips: string[];
}

export interface ProfileReviewResponse {
  scores: ProfileScore;
  feedback: ProfileFeedback;
  summary: string;
  model: string;
  usage: UsageSummary;
}

// ─── AI Photos ────────────────────────────────────────────────────────────────
export type PhotoStyle = 'professional' | 'casual' | 'adventurous' | 'artistic';

export interface AIPhotosRequest {
  style: PhotoStyle;
  photos: string[]; // base64 encoded
}

export interface AIPhotosResponse {
  message: string;
  usage: UsageSummary;
}

// ─── NIM Models ──────────────────────────────────────────────────────────────
export interface NIMModel {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  contextWindow: number;
  supportsVision: boolean;
}

// ─── API Error ───────────────────────────────────────────────────────────────
export interface APIError {
  error: string;
  code?: string;
}
