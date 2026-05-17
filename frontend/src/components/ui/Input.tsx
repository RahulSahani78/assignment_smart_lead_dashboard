import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, hint, error, leftIcon, rightSlot, className, id, ...rest }, ref) => {
    const inputId = id ?? `input-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'input',
              leftIcon && 'pl-9',
              rightSlot && 'pr-10',
              error &&
                'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-500',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error || hint ? `${inputId}-msg` : undefined}
            {...rest}
          />
          {rightSlot && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              {rightSlot}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            id={`${inputId}-msg`}
            className={clsx(
              'mt-1.5 text-xs',
              error ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
