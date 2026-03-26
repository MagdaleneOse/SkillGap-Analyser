// src/components/ResultsDashboard.tsx

import React from 'react';
import type { AnalysisResult } from '../types';
import MatchScoreCard from './MatchScoreCard';
import SkillGapList from './SkillGapList';


interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  return (
    <div className="dashboard-wrapper">

      <div className="dashboard-header">
        <h2>Analysis Results</h2>
        <button className="reset-button" onClick={onReset}>
          Analyse Another CV
        </button>
      </div>

      {/* Top row — score card + skill gap list */}
      <div className="dashboard-top-row">
        <MatchScoreCard percentage={result.matchPercentage} />
        <SkillGapList
          matchedSkills={result.matchedSkills}
          missingSkills={result.missingSkills}
          recommendations={result.recommendations}
        />
      </div>

      {/* Charts section — placeholder for Phase 6 */}
      <div className="charts-placeholder">
        <p>Charts will appear here in Phase 6.</p>
      </div>

    </div>
  );
}

export default ResultsDashboard;