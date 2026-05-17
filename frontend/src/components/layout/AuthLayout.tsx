import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  rightSide?: ReactNode;
}

const AuthLayout = ({ title, subtitle, children, rightSide }: Props) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-700 lg:flex lg:flex-col lg:justify-between lg:p-12 lg:text-white">
        <div className="flex items-center gap-2 text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M17 7h4v4" />
            </svg>
          </span>
          <span className="text-sm font-semibold">Smart Leads</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Convert more leads.
            <br />
            Track every interaction.
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/85">
            A modern dashboard to capture, qualify and close leads — built with
            React, Node, MongoDB and TypeScript.
          </p>
          {rightSide && <div className="mt-8">{rightSide}</div>}
        </div>

        <div className="text-xs text-white/70">
          © {new Date().getFullYear()} Smart Leads
        </div>
        <div className="pointer-events-none absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex flex-col bg-white p-6 dark:bg-slate-950 sm:p-10">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
