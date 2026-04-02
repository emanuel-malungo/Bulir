import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-medium rounded-md focus:outline-none focus:ring-2 cursor-pointer transition-colors duration-200';

    const variantStyles = {
      primary: 'bg-accent text-white hover:bg-accent/80 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const sizeStyles = {
      sm: 'py-1 px-3 text-xs',
      md: 'py-2 px-4 text-sm',
      lg: 'py-3 px-6 text-base',
    };

    const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={finalClassName}
        {...props}
      >
        {isLoading ? 'Carregando...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
