// src/components/MatchScoreCard.tsx

import AnimatedScoreRing from './AnimatedScoreRing';

interface MatchScoreCardProps {
  percentage: number;
}

function getScoreColour(percentage: number): string {
  if (percentage >= 70) return '#22c55e';
  if (percentage >= 40) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(percentage: number): string {
  if (percentage >= 70) return 'Strong Match';
  if (percentage >= 40) return 'Partial Match';
  return 'Low Match';
}

function MatchScoreCard({ percentage }: MatchScoreCardProps) {
  const colour = getScoreColour(percentage);
  const label = getScoreLabel(percentage);

  return (
    <div className="score-card animate-fade-up">
      <h3 className="card-title">Overall Match</h3>

      <div className="score-circle-wrapper">
        <AnimatedScoreRing percentage={percentage} />
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
        {percentage >= 70
          ? 'Your profile aligns well with this role.'
          : percentage >= 40
          ? 'Several skill gaps identified. Review recommendations below.'
          : 'Significant gaps exist. Focus on the missing skills listed below.'}
      </p>
    </div>
  );
}

export default MatchScoreCard;