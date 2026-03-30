// src/components/HistoryTable.tsx

import type { AnalysisRecord } from '../types';

interface HistoryTableProps {
  records: AnalysisRecord[];
  isLoading: boolean;
  onSelect: (record: AnalysisRecord) => void;
}

function getScoreColour(percentage: number): string {
  if (percentage >= 75) return '#16a34a';
  if (percentage >= 50) return '#d97706';
  return '#dc2626';
}

function getScoreBackground(percentage: number): string {
  if (percentage >= 75) return '#dcfce7';
  if (percentage >= 50) return '#fef3c7';
  return '#fee2e2';
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function HistoryTable({ records, isLoading, onSelect }: HistoryTableProps) {
  if (isLoading) {
    return (
      <div className="history-container">
        <h3 className="history-title">Recent Analyses</h3>
        <div className="history-loading">Loading history...</div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="history-container">
        <h3 className="history-title">Recent Analyses</h3>
        <div className="history-empty">
          No analyses yet. Submit your first CV above to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h3 className="history-title">
        Recent Analyses
        <span className="history-count">{records.length}</span>
      </h3>

      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>CV Preview</th>
              <th>Job Preview</th>
              <th>Match</th>
              <th>Gaps</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="history-row">
                <td className="date-cell">
                  {formatDate(record.created_at)}
                </td>
                <td className="preview-cell">
                  {truncate(record.cv_text, 60)}
                </td>
                <td className="preview-cell">
                  {truncate(record.job_description, 60)}
                </td>
                <td className="score-cell">
                  <span
                    className="score-badge"
                    style={{
                      color: getScoreColour(record.match_percentage),
                      backgroundColor: getScoreBackground(record.match_percentage),
                    }}
                  >
                    {record.match_percentage}%
                  </span>
                </td>
                <td className="gaps-cell">
                  {record.missing_skills.length} skill
                  {record.missing_skills.length !== 1 ? 's' : ''}
                </td>
                <td className="action-cell">
                  <button
                    className="view-button"
                    onClick={() => onSelect(record)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryTable;