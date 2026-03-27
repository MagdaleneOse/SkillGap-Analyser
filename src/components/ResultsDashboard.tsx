// src/components/ResultsDashboard.tsx

import React from 'react';
import type { AnalysisResult } from '../types';
import MatchScoreCard from './MatchScoreCard';
import SkillGapList from './SkillGapList';
import RadarChartView from './RadarChartView';
import BarChartView from './BarChartView';
import AnimatedSkillBar from './AnimatedSkillBar';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  return (
    <div className="dashboard-wrapper stagger-children">

      {/* Header */}
      <div className="dashboard-header animate-fade-up">
        <h2>Analysis Results</h2>
        <button className="reset-button" onClick={onReset}>
          Analyse Another CV
        </button>
      </div>

      {/* Row 1 — Score card + Skill gap list */}
      <div className="dashboard-top-row animate-fade-up">
        <MatchScoreCard percentage={result.matchPercentage} />
        <SkillGapList
          matchedSkills={result.matchedSkills}
          missingSkills={result.missingSkills}
          recommendations={result.recommendations}
        />
      </div>

      {/* Category score bars */}
      <div className="chart-card animate-fade-up">
        <h3 className="chart-title">Category Scores</h3>
        <p className="chart-subtitle">Animated breakdown per competency area</p>
        {result.categoryScores.map((cat, i) => (
          <AnimatedSkillBar
            key={cat.category}
            label={cat.category}
            score={cat.score}
            delay={i * 80}
          />
        ))}
      </div>

      {/* Row 2 — Charts side by side */}
      <div className="charts-row animate-fade-up">
        <RadarChartView categoryScores={result.categoryScores} />
        <BarChartView categoryScores={result.categoryScores} />
      </div>

    </div>
  );
}

export default ResultsDashboard;