
// src/components/ResultsDashboard.tsx

import React from 'react';
import type { AnalysisResult } from '../types';
import MatchScoreCard from './MatchScoreCard';
import SkillGapList from './SkillGapList';
import RadarChartView from './RadarChartView';
import BarChartView from './BarChartView';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  return (
    <div className="dashboard-wrapper">

      {/* Header */}
      <div className="dashboard-header">
        <h2>Analysis Results</h2>
        <button className="reset-button" onClick={onReset}>
          Analyse Another CV
        </button>
      </div>

      {/* Row 1 — Score card + Skill gap list */}
      <div className="dashboard-top-row">
        <MatchScoreCard percentage={result.matchPercentage} />
        <SkillGapList
          matchedSkills={result.matchedSkills}
          missingSkills={result.missingSkills}
          recommendations={result.recommendations}
        />
      </div>

      {/* Row 2 — Charts side by side */}
      <div className="charts-row">
        <RadarChartView categoryScores={result.categoryScores} />
        <BarChartView categoryScores={result.categoryScores} />
      </div>

    </div>
  );
}

export default ResultsDashboard;