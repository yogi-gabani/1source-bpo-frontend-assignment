import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type LayoutProps = React.PropsWithChildren

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'app-theme'

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      document.documentElement.setAttribute('data-theme', stored)
      return
    }
    // fallback to light
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', next)
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
      return next
    })
  }

  return (
    <main className="min-h-screen bg-[color:var(--app-bg)] text-[color:var(--app-text)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <header className="rounded-2xl border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface)]/95 px-5 py-4 shadow-sm shadow-indigo-100">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[color:var(--app-accent-strong)]">
                Support Dashboard
              </h1>
              <p className="mt-1 text-xs text-[color:var(--app-text-muted)]">
                Explore each section below.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface-subtle)] px-3 py-1 text-xs font-medium text-[color:var(--app-text)] shadow-sm transition-colors hover:border-[color:var(--app-accent)] hover:text-[color:var(--app-accent-strong)]"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: theme === 'light' ? '#facc15' : '#38bdf8',
                }}
              />
              {theme === 'light' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
          <nav className="flex flex-wrap gap-2 text-xs">
            <Link
              to="/q1"
              className="inline-flex items-center justify-between rounded-lg bg-[color:var(--app-accent-soft)] px-3 py-2 text-[color:var(--app-accent-strong)] shadow-sm transition-colors hover:bg-[color:var(--app-accent)] hover:text-white"
            >
              <span>Q1 – Live Transcript</span>
              <span className="text-[10px] opacity-80">Real-time</span>
            </Link>
            <Link
              to="/q2-q3"
              className="inline-flex items-center justify-between rounded-lg bg-[color:var(--app-accent-soft)] px-3 py-2 text-[color:var(--app-accent-strong)] shadow-sm transition-colors hover:bg-[color:var(--app-accent)] hover:text-white"
            >
              <span>Q2–Q3 – State &amp; Escalation</span>
              <span className="text-[10px] opacity-80">Optimistic UI</span>
            </Link>
            <Link
              to="/q4"
              className="inline-flex items-center justify-between rounded-lg bg-[color:var(--app-accent-soft)] px-3 py-2 text-[color:var(--app-accent-strong)] shadow-sm transition-colors hover:bg-[color:var(--app-accent)] hover:text-white"
            >
              <span>Q4 – High-Frequency Data</span>
              <span className="text-[10px] opacity-80">Batched updates</span>
            </Link>
            <Link
              to="/q5"
              className="inline-flex items-center justify-between rounded-lg bg-[color:var(--app-accent-soft)] px-3 py-2 text-[color:var(--app-accent-strong)] shadow-sm transition-colors hover:bg-[color:var(--app-accent)] hover:text-white"
            >
              <span>Q5 – Account Switcher</span>
              <span className="text-[10px] opacity-80">Multi-tenant</span>
            </Link>
            <Link
              to="/q6"
              className="inline-flex items-center justify-between rounded-lg bg-[color:var(--app-accent-soft)] px-3 py-2 text-[color:var(--app-accent-strong)] shadow-sm transition-colors hover:bg-[color:var(--app-accent)] hover:text-white"
            >
              <span>Q6 – Sentiment Charts</span>
              <span className="text-[10px] opacity-80">Real-time</span>
            </Link>
          </nav>
        </header>

        <section className="flex flex-col gap-5">{children}</section>
      </div>
    </main>
  )
}

