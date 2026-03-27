import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (signUpError) {
          console.error('SIGN UP ERROR:', signUpError);
          setError(signUpError.message);
        } else {
          setMessage(
            'Account created. Check your email to confirm your address, then log in.'
          );
          setMode('login');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          console.error('SIGN IN ERROR:', signInError);
          setError(signInError.message);
          return;
        }
      }
    } catch (err) {
      console.error('UNEXPECTED AUTH ERROR:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-fade-up">
        <div className="auth-header">
          <h1 className="auth-logo">SkillGap Analyser</h1>
          <p className="auth-tagline">
            {mode === 'login'
              ? 'Sign in to access your analyses.'
              : 'Create an account to get started.'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab${mode === 'login' ? ' active' : ''}`}
            onClick={() => {
              setMode('login');
              setError(null);
              setMessage(null);
            }}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`auth-tab${mode === 'register' ? ' active' : ''}`}
            onClick={() => {
              setMode('register');
              setError(null);
              setMessage(null);
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="auth-error animate-shake">{error}</div>}
          {message && <div className="auth-message">{message}</div>}

          <button
            type="submit"
            className="submit-button"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={isLoading}
          >
            {isLoading
              ? mode === 'login'
                ? 'Signing in...'
                : 'Creating account...'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;