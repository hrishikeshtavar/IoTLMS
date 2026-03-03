import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', loading, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'rounded-[var(--radius-md)] font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-[var(--color-primary)] text-white hover:brightness-110 active:brightness-90',
      secondary: 'border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 active:bg-[var(--color-primary)]/10',
      accent: 'bg-[var(--color-accent)] text-white hover:brightness-110 active:brightness-90',
      ghost: 'text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 active:bg-[var(--color-primary)]/10',
      danger: 'bg-[var(--color-error)] text-white hover:brightness-110 active:brightness-90',
    };
    
    const sizes = {
      small: 'h-8 px-3 text-sm',
      medium: 'h-9 px-4 text-body',
      large: 'h-10 px-5 text-body',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
