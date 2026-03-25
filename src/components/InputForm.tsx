// src/components/InputForm.tsx

import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (cvText: string, jobDescription: string) => void;
  isLoading: boolean;
}

function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [cvText, setCvText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [errors, setErrors] = useState({ cv: '', job: '' });

  function validate(): boolean {
    const newErrors = { cv: '', job: '' };
    let isValid = true;

    if (cvText.trim().length < 50) {
      newErrors.cv = 'CV text must be at least 50 characters.';
      isValid = false;
    }

    if (jobDescription.trim().length < 50) {
      newErrors.job = 'Job description must be at least 50 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(cvText.trim(), jobDescription.trim());
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Analyse Your CV</h2>
        <p>Paste your CV and a job description below to identify skill gaps.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">

          {/* CV Input */}
          <div className="field-group">
            <label htmlFor="cv-input">
              Your CV
              <span className="char-count">{cvText.length} characters</span>
            </label>
            <textarea
              id="cv-input"
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your full CV text here..."
              rows={14}
              disabled={isLoading}
              className={errors.cv ? 'textarea-error' : ''}
            />
            {errors.cv && (
              <span className="error-message">{errors.cv}</span>
            )}
          </div>

          {/* Job Description Input */}
          <div className="field-group">
            <label htmlFor="job-input">
              Job Description
              <span className="char-count">{jobDescription.length} characters</span>
            </label>
            <textarea
              id="job-input"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={14}
              disabled={isLoading}
              className={errors.job ? 'textarea-error' : ''}
            />
            {errors.job && (
              <span className="error-message">{errors.job}</span>
            )}
          </div>

        </div>

        <div className="submit-row">
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <span className="button-loading">
                <span className="spinner" />
                Analysing...
              </span>
            ) : (
              'Analyse CV'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InputForm;