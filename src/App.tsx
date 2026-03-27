

// src/App.tsx

import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryTable from './components/HistoryTable';
import { analyseCV } from './lib/analyseCV';
import { saveAnalysis, loadAnalysisHistory } from './lib/supabaseClient';
import type{ AnalysisResult, AnalysisRecord } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Load history when the app first opens
  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setHistoryLoading(true);
    try {
      const records = await loadAnalysisHistory();
      setHistory(records);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleAnalyse(cvText: string, jobDescription: string) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1 — call Gemini API
      const analysisResult = await analyseCV(cvText, jobDescription);

      // Step 2 — save to Supabase
      await saveAnalysis(cvText, jobDescription, analysisResult);

      // Step 3 — refresh history list
      await fetchHistory();

      // Step 4 — show results
      setResult(analysisResult);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  // Convert a history record back into an AnalysisResult for display
  function handleSelectRecord(record: AnalysisRecord) {
    const restored: AnalysisResult = {
      matchPercentage: record.match_percentage,
      matchedSkills: record.matched_skills,
      missingSkills: record.missing_skills,
      recommendations: record.recommendations,
      categoryScores: record.category_scores,
    };
    setResult(restored);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-inner">
          <h1>SkillGap Analyser</h1>
          <p>Compare your CV against any job description instantly.</p>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!result ? (
          <>
            <InputForm
              onSubmit={handleAnalyse}
              isLoading={isLoading}
            />
            <HistoryTable
              records={history}
              isLoading={historyLoading}
              onSelect={handleSelectRecord}
            />
          </>
        ) : (
          <ResultsDashboard
            result={result}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Built by Magdalene · WSEI Lublin · 2025</p>
      </footer>
    </div>
  );
}

export default App;