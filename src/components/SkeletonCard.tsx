// src/components/SkeletonCard.tsx

import React from 'react';

function SkeletonCard() {
  return (
    <div className="score-card" style={{ gap: '1rem' }}>
      <div className="skeleton-block" style={{ height: '14px', width: '60%' }} />
      <div className="skeleton-block" style={{ height: '140px', width: '140px', borderRadius: '50%' }} />
      <div className="skeleton-block" style={{ height: '12px', width: '40%' }} />
      <div className="skeleton-block" style={{ height: '10px', width: '80%' }} />
      <div className="skeleton-block" style={{ height: '10px', width: '65%' }} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;