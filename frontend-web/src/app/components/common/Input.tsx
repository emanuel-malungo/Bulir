import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 transition-colors duration-200';

    const stateStyles = error
      ? 'border border-red-500 focus:ring-red-500'
      : 'border border-gray-300 focus:ring-accent/50';

    const finalClassName = `${baseStyles} ${stateStyles} ${className}`;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="block text-sm font-medium text-gray-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={finalClassName}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
        {helperText && !error && (
          <span className="text-xs text-gray-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
