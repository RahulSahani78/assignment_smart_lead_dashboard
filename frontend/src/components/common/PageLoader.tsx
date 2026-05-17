interface Props {
  label?: string;
}

const PageLoader = ({ label = 'Loading…' }: Props) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
      <svg
        className="h-10 w-10 animate-spin text-brand-600"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-sm font-medium">{label}</p>
    </div>
  </div>
);

export default PageLoader;
