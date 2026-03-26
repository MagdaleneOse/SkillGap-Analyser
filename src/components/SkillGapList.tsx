// src/components/SkillGapList.tsx

import React from 'react';

interface SkillGapListProps {
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

function SkillGapList({
  matchedSkills,
  missingSkills,
  recommendations,
}: SkillGapListProps) {
  return (
    <div className="skill-gap-wrapper">

      {/* Matched Skills */}
      <div className="skill-section">
        <div className="skill-section-header matched">
          <span className="skill-icon">✓</span>
          <h3>Matched Skills</h3>
          <span className="skill-count">{matchedSkills.length}</span>
        </div>
        <div className="skill-tags">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill, index) => (
              <span key={index} className="skill-tag matched-tag">
                {skill}
              </span>
            ))
          ) : (
            <p className="no-skills">No matched skills identified.</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="skill-section">
        <div className="skill-section-header missing">
          <span className="skill-icon">✗</span>
          <h3>Missing Skills</h3>
          <span className="skill-count">{missingSkills.length}</span>
        </div>
        <div className="skill-tags">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill, index) => (
              <span key={index} className="skill-tag missing-tag">
                {skill}
              </span>
            ))
          ) : (
            <p className="no-skills">No skill gaps identified.</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="skill-section recommendations-section">
        <div className="skill-section-header recommendations">
          <span className="skill-icon">→</span>
          <h3>Recommendations</h3>
        </div>
        <ol className="recommendations-list">
          {recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              {rec}
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}

export default SkillGapList;