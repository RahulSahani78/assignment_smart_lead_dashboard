import Button from '../ui/Button';

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not complete that request. Please try again.',
  onRetry,
}: Props) => (
  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-4 rounded-2xl bg-rose-50 p-4 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
      <svg
        className="h-10 w-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
      {title}
    </h3>
    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
      {message}
    </p>
    {onRetry && (
      <Button variant="secondary" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export default ErrorState;
