import React, { useState } from 'react';
import InputForm from './components/InputForm';
import { analyseCV, type AnalysisResult } from './lib/analyseCV';

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
      console.log('Analysis complete:', analysisResult);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      console.error('Analysis failed:', message);
    } finally {
      setIsLoading(false);
    }
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
        <InputForm onSubmit={handleAnalyse} isLoading={isLoading} />

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="raw-result">
            <h3>Raw API Result (Phase 4 verification)</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built by Magdalene · WSEI Lublin · 2025</p>
      </footer>
    </div>
  );
}

export default App;