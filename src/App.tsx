// src/App.tsx

import React, { useState } from 'react';
import InputForm from './components/InputForm';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyse(cvText: string, jobDescription: string) {
    setIsLoading(true);
    // AI analysis logic will be added in Phase 4
    console.log('CV length:', cvText.length);
    console.log('JD length:', jobDescription.length);
    console.log('Form submitted successfully — Phase 4 will handle analysis.');
    setIsLoading(false);
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
        <InputForm
          onSubmit={handleAnalyse}
          isLoading={isLoading}
        />
      </main>

      <footer className="app-footer">
        <p>Built by Magdalene · WSEI Lublin · 2025</p>
      </footer>
    </div>
  );
}

export default App;