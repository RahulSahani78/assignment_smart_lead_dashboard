import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

const DefaultIcon = () => (
  <svg
    className="h-12 w-12 text-slate-300 dark:text-slate-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7h18M3 12h18M3 17h12" />
  </svg>
);

const EmptyState = ({ title, description, action, icon }: Props) => (
  <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
    <div className="mb-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
      {icon ?? <DefaultIcon />}
    </div>
    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
      {title}
    </h3>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
