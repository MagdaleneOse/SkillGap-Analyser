// src/App.tsx

import { useState, useEffect, lazy, Suspense } from 'react';
import InputForm from './components/InputForm';
import AnalysisOverlay from './components/AnalysisOverlay';
import ErrorCard from './components/ErrorCard';
import ToastContainer from './components/ToastContainer';
import AuthForm from './components/AuthForm';
import { DashboardSkeleton } from './components/SkeletonCard';
import { analyseCV } from './lib/analyseCV';
import {
  saveAnalysis,
  loadAnalysisHistory,
  supabase,
} from './lib/supabaseClient';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import type { AnalysisResult, AnalysisRecord } from './types';

const ResultsDashboard = lazy(() => import('./components/ResultsDashboard'));
const HistoryTable = lazy(() => import('./components/HistoryTable'));

type Phase = 'idle' | 'analysing' | 'results' | 'error';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    if (user) {
      void fetchHistory();
    } else {
      setHistory([]);
      setHistoryLoading(false);
    }
  }, [user]);

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

  async function handleSignOut() {
    await supabase.auth.signOut();
    handleReset();
    addToast('info', 'Signed out successfully.');
  }

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="overlay-spinner" style={{ margin: '0 auto' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthForm />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <div className="app-wrapper">
      <AnalysisOverlay visible={phase === 'analysing'} />
      <ToastContainer toasts={toasts} />

      <header className="app-header">
        <div className="header-inner">
          <h1>SkillGap Analyser</h1>
          <p>Compare your CV against any job description instantly.</p>
        </div>
        <div className="header-user">
          <span className="header-email">{user.email}</span>
          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="app-main">
        {phase === 'error' && error && (
          <ErrorCard message={error} onRetry={handleReset} />
        )}

        {phase === 'analysing' && <DashboardSkeleton />}

        {phase === 'results' && result && (
          <Suspense fallback={<DashboardSkeleton />}>
            <ResultsDashboard result={result} onReset={handleReset} />
          </Suspense>
        )}

        {(phase === 'idle' || phase === 'error') && (
          <>
            <InputForm onSubmit={handleAnalyse} isLoading={false} />
            <Suspense fallback={<div className="history-loading">Loading history...</div>}>
              <HistoryTable
                records={history}
                isLoading={historyLoading}
                onSelect={handleSelectRecord}
              />
            </Suspense>
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