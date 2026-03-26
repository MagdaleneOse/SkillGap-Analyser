// src/App.tsx

import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import { analyseCV } from './lib/analyseCV';
import type { AnalysisResult } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyse(cvText: string, jobDescription: string) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyseCV(cvText, jobDescription);
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
          <InputForm
            onSubmit={handleAnalyse}
            isLoading={isLoading}
          />
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