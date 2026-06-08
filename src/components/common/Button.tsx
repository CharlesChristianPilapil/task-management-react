import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/features/shared/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
    return (
        <button
            type="button"
            className={cn(
                'rounded px-4 py-2 text-sm font-medium',
                variant === 'primary' && 'bg-purple-600 text-white',
                variant === 'secondary' && 'border border-gray-300 bg-white text-gray-700',
                className,
            )}
            {...props}
        />
    );
}
