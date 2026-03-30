// src/components/AnalysisOverlay.tsx

import { useState, useEffect } from 'react';

const STEPS = [
  'Reading your CV...',
  'Parsing job requirements...',
  'Matching skills and experience...',
  'Calculating category scores...',
  'Generating recommendations...',
  'Finalising your results...',
];

interface AnalysisOverlayProps {
  visible: boolean;
}

function AnalysisOverlay({ visible }: AnalysisOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card">
        <div className="overlay-spinner" />
        <p className="overlay-title">Analysing your CV</p>
        <p className="overlay-step" key={stepIndex}>
          {STEPS[stepIndex]}
        </p>
        <div className="overlay-dots">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`overlay-dot${i <= stepIndex ? ' active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalysisOverlay;