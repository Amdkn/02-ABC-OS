'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Mode = 'signin' | 'signup';

function validateEmail(email: string): string | null {
  if (email.trim().length === 0) return 'Email is required';
  // Conservative regex — matches what most users expect
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (password.length === 0) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

export default function LoginForm() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
    setConfirm('');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    startTransition(async () => {
      if (mode === 'signin') {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.push('/');
        router.refresh();
      } else {
        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        setNotice(
          'Account created. Check your email to confirm, then sign in.',
        );
        setMode('signin');
        setPassword('');
        setConfirm('');
      }
    });
  };

  // If the user is already signed in, show a soft "already signed in" state.
  if (user && !isPending) {
    return (
      <div
        className="card"
        style={{
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div className="eyebrow">ABC OS</div>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Fraunces, serif',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: '28px',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          You&rsquo;re already <em style={{ color: 'var(--primary)' }}>signed in</em>
        </h1>
        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '14px' }}>
          Signed in as <b>{user.email}</b>
        </p>
        <Link
          href="/"
          className="btn-primary"
          style={{ alignSelf: 'flex-start' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            arrow_forward
          </span>
          Go to dashboard
        </Link>
      </div>
    );
  }

  const heading = mode === 'signin' ? 'Welcome back' : 'Create your account';
  const subheading =
    mode === 'signin'
      ? 'Sign in to continue to your cooperative dashboard.'
      : 'Sign up to incorporate your individual profile on ABC OS.';

  return (
    <div
      className="card"
      style={{
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      <div>
        <div className="eyebrow" style={{ marginBottom: '8px' }}>
          ABC OS · {mode === 'signin' ? 'Sign in' : 'Sign up'}
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Fraunces, serif',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: '30px',
            lineHeight: 1.08,
            letterSpacing: '-0.015em',
          }}
        >
          {heading.split(' ')[0]}{' '}
          <em style={{ color: 'var(--primary)' }}>
            {heading.split(' ').slice(1).join(' ') || heading}
          </em>
        </h1>
        <p
          style={{
            margin: '8px 0 0',
            color: 'var(--ink-soft)',
            fontSize: '14px',
            lineHeight: 1.5,
          }}
        >
          {subheading}
        </p>
      </div>

      {/* Mode toggle */}
      <div
        role="tablist"
        aria-label="Authentication mode"
        className="seg"
        style={{ alignSelf: 'stretch' }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signin'}
          className={mode === 'signin' ? 'on' : ''}
          onClick={() => switchMode('signin')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined">login</span>
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          className={mode === 'signup' ? 'on' : ''}
          onClick={() => switchMode('signup')}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <span className="material-symbols-outlined">person_add</span>
          Sign up
        </button>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <label
          htmlFor="login-email"
          style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--ink-soft)',
            }}
          >
            Email
          </span>
          <input
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@cooperative.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            required
            style={{
              height: '48px',
              padding: '0 14px',
              borderRadius: '13px',
              background: 'var(--card-2)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              fontSize: '15px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
        </label>

        <label
          htmlFor="login-password"
          style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <span
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--ink-soft)',
            }}
          >
            Password
          </span>
          <input
            id="login-password"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            placeholder={mode === 'signin' ? 'Your password' : 'At least 8 characters'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            required
            minLength={8}
            style={{
              height: '48px',
              padding: '0 14px',
              borderRadius: '13px',
              background: 'var(--card-2)',
              border: '1px solid var(--line)',
              color: 'var(--ink)',
              fontSize: '15px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
        </label>

        {mode === 'signup' ? (
          <label
            htmlFor="login-confirm"
            style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <span
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--ink-soft)',
              }}
            >
              Confirm password
            </span>
            <input
              id="login-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={isPending}
              required
              minLength={8}
              style={{
                height: '48px',
                padding: '0 14px',
                borderRadius: '13px',
                background: 'var(--card-2)',
                border: '1px solid var(--line)',
                color: 'var(--ink)',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </label>
        ) : null}

        {error ? (
          <div
            role="alert"
            style={{
              padding: '12px 14px',
              borderRadius: '13px',
              background:
                'color-mix(in srgb, var(--danger) 16%, var(--card))',
              border:
                '1px solid color-mix(in srgb, var(--danger) 40%, transparent)',
              color: 'var(--ink)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--danger)', fontSize: '20px' }}
            >
              error
            </span>
            <span>{error}</span>
          </div>
        ) : null}

        {notice ? (
          <div
            role="status"
            style={{
              padding: '12px 14px',
              borderRadius: '13px',
              background:
                'color-mix(in srgb, var(--ok) 16%, var(--card))',
              border:
                '1px solid color-mix(in srgb, var(--ok) 40%, transparent)',
              color: 'var(--ink)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: 'var(--ok)', fontSize: '20px' }}
            >
              check_circle
            </span>
            <span>{notice}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
          style={{
            height: '50px',
            width: '100%',
            justifyContent: 'center',
            fontSize: '15px',
            marginTop: '4px',
            opacity: isPending ? 0.7 : 1,
            cursor: isPending ? 'wait' : 'pointer',
          }}
        >
          {isPending ? (
            <>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px' }}
              >
                progress_activity
              </span>
              {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
            </>
          ) : (
            <>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px' }}
              >
                {mode === 'signin' ? 'login' : 'how_to_reg'}
              </span>
              {mode === 'signin' ? 'Sign in' : 'Sign up with email'}
            </>
          )}
        </button>
      </form>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--ink-soft)',
          fontSize: '13px',
        }}
      >
        <span
          style={{ flex: 1, height: '1px', background: 'var(--line)' }}
          aria-hidden="true"
        />
        <span>
          {mode === 'signin'
            ? 'New to ABC OS?'
            : 'Already have an account?'}
        </span>
        <span
          style={{ flex: 1, height: '1px', background: 'var(--line)' }}
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
        style={{
          background: 'var(--card-2)',
          border: '1px solid var(--line)',
          borderRadius: '13px',
          height: '48px',
          fontFamily: 'inherit',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--ink)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
          {mode === 'signin' ? 'person_add' : 'login'}
        </span>
        {mode === 'signin' ? 'Create a new account' : 'I already have an account'}
      </button>

      <p
        style={{
          margin: 0,
          textAlign: 'center',
          color: 'var(--ink-faint)',
          fontSize: '11.5px',
          letterSpacing: '0.04em',
        }}
      >
        By continuing you accept the cooperative charter.
      </p>
    </div>
  );
}
