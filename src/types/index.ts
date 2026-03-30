export interface AnalysisResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  categoryScores: CategoryScore[];
}

export type CategoryScore = {
  category: string;
  score: number;
};

export interface AnalysisRecord {
  id: string;
  created_at: string;
  cv_text: string;
  job_description: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
  category_scores: CategoryScore[];
}