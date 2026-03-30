// src/components/AnimatedScoreRing.tsx

interface AnimatedScoreRingProps {
  percentage: number;
}

function getColour(percentage: number): string {
  if (percentage >= 70) return '#22c55e';
  if (percentage >= 40) return '#f59e0b';
  return '#ef4444';
}

function AnimatedScoreRing({ percentage }: AnimatedScoreRingProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (percentage / 100) * circumference;
  const colour = getColour(percentage);

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 120 120"
      className="score-ring-svg"
      style={{
        ['--circumference' as string]: circumference,
        ['--target-offset' as string]: targetOffset,
      }}
    >
      {/* Track */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth="10"
      />
      {/* Animated progress */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={colour}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={targetOffset}
        transform="rotate(-90 60 60)"
        className="progress-ring"
      />
    </svg>
  );
}

export default AnimatedScoreRing;