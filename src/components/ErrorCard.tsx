// src/components/ErrorCard.tsx

import React from 'react';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
}

function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="error-card animate-shake">
      <span className="error-card-icon">⚠</span>
      <div>
        <p className="error-card-title">Analysis Failed</p>
        <p className="error-card-message">{message}</p>
        <button className="error-card-retry" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default ErrorCard;