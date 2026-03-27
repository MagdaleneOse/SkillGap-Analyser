// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import type { AnalysisRecord, AnalysisResult } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Save a new analysis result to the database ──

export async function saveAnalysis(
  cvText: string,
  jobDescription: string,
  result: AnalysisResult
): Promise<void> {
  const { error } = await supabase.from('analyses').insert({
    cv_text: cvText,
    job_description: jobDescription,
    match_percentage: result.matchPercentage,
    matched_skills: result.matchedSkills,
    missing_skills: result.missingSkills,
    recommendations: result.recommendations,
    category_scores: result.categoryScores,
  });

  if (error) {
    throw new Error(`Failed to save analysis: ${error.message}`);
  }
}

// ── Load the 10 most recent analyses from the database ──

export async function loadAnalysisHistory(): Promise<AnalysisRecord[]> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to load history: ${error.message}`);
  }

  return data as AnalysisRecord[];
}