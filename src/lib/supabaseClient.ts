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

export async function saveAnalysis(
  cvText: string,
  jobDescription: string,
  result: AnalysisResult
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to save an analysis.');
  }

  const { error } = await supabase.from('analyses').insert({
    user_id: user.id,
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

export async function loadAnalysisHistory(): Promise<AnalysisRecord[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to load analysis history.');
  }

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(`Failed to load history: ${error.message}`);
  }

  return data as AnalysisRecord[];
}