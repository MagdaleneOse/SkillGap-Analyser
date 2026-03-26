// src/components/MatchScoreCard.tsx

import React from 'react';

interface MatchScoreCardProps {
  percentage: number;
}

function getScoreColour(percentage: number): string {
  if (percentage >= 75) return '#22c55e';
  if (percentage >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(percentage: number): string {
  if (percentage >= 75) return 'Strong Match';
  if (percentage >= 50) return 'Partial Match';
  return 'Low Match';
}

function MatchScoreCard({ percentage }: MatchScoreCardProps) {
  const colour = getScoreColour(percentage);
  const label = getScoreLabel(percentage);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="score-card">
      <h3 className="card-title">Overall Match</h3>

      <div className="score-circle-wrapper">
        <svg width="140" height="140" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={colour}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>

        <div className="score-text">
          <span className="score-number" style={{ color: colour }}>
            {percentage}%
          </span>
        </div>
      </div>

      <div className="score-label" style={{ color: colour }}>
        {label}
      </div>

      <p className="score-description">
        {percentage >= 75
          ? 'Your profile aligns well with this role.'
          : percentage >= 50
          ? 'Several skill gaps identified. Review recommendations below.'
          : 'Significant gaps exist. Focus on the missing skills listed below.'}
      </p>
    </div>
  );
}

export default MatchScoreCard;