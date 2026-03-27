// src/App.tsx

import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import HistoryTable from './components/HistoryTable';
import AnalysisOverlay from './components/AnalysisOverlay';
import ErrorCard from './components/ErrorCard';
import ToastContainer from './components/ToastContainer';
import { DashboardSkeleton } from './components/SkeletonCard';
import { analyseCV } from './lib/analyseCV';
import { saveAnalysis, loadAnalysisHistory } from './lib/supabaseClient';
import { useToast } from './hooks/useToast';
import type { AnalysisResult, AnalysisRecord } from './types';

type Phase = 'idle' | 'analysing' | 'results' | 'error';

function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { toasts, addToast } = useToast();

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
    setPhase('analysing');
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyseCV(cvText, jobDescription);
      await saveAnalysis(cvText, jobDescription, analysisResult);
      await fetchHistory();
      setResult(analysisResult);
      setPhase('results');
      addToast('success', 'Analysis complete and saved.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      setPhase('error');
      addToast('error', 'Analysis failed. Please try again.');
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setPhase('idle');
  }

  function handleSelectRecord(record: AnalysisRecord) {
    const restored: AnalysisResult = {
      matchPercentage: record.match_percentage,
      matchedSkills: record.matched_skills,
      missingSkills: record.missing_skills,
      recommendations: record.recommendations,
      categoryScores: record.category_scores,
    };
    setResult(restored);
    setPhase('results');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-wrapper">
      {/* Full-screen analysis overlay */}
      <AnalysisOverlay visible={phase === 'analysing'} />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />

      <header className="app-header">
        <div className="header-inner">
          <h1>SkillGap Analyser</h1>
          <p>Compare your CV against any job description instantly.</p>
        </div>
      </header>

      <main className="app-main">

        {/* Error state */}
        {phase === 'error' && error && (
          <ErrorCard message={error} onRetry={handleReset} />
        )}

        {/* Analysing state — show skeleton behind overlay */}
        {phase === 'analysing' && <DashboardSkeleton />}

        {/* Results state */}
        {phase === 'results' && result && (
          <ResultsDashboard result={result} onReset={handleReset} />
        )}

        {/* Idle and error states — show form and history */}
        {(phase === 'idle' || phase === 'error') && (
          <>
            <InputForm onSubmit={handleAnalyse} isLoading={false} />
            <HistoryTable
              records={history}
              isLoading={historyLoading}
              onSelect={handleSelectRecord}
            />
          </>
        )}

      </main>

      <footer className="app-footer">
        <p>Built by Magdalene · WSEI Lublin · 2025</p>
      </footer>
    </div>
  );
}

export default App;