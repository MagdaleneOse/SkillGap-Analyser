// src/components/AnimatedSkillBar.tsx

import React from 'react';

interface AnimatedSkillBarProps {
  label: string;
  score: number;
  delay?: number;
}

function getBarColour(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function AnimatedSkillBar({ label, score, delay = 0 }: AnimatedSkillBarProps) {
  return (
    <div className="skill-bar-row animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="skill-bar-label-row">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            ['--bar-width' as string]: `${score}%`,
            animationDelay: `${delay + 100}ms`,
            background: getBarColour(score),
          }}
        />
      </div>
    </div>
  );
}

export default AnimatedSkillBar;