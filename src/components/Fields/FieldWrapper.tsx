import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FieldWrapperProps = {
    label?: string;
    name?: string;
    error?: string;
    readOnly?: boolean;
    wrapperClassName?: string;
    children: ReactNode;
};

export function FieldWrapper({
    label,
    name,
    error,
    readOnly,
    wrapperClassName,
    children,
}: FieldWrapperProps) {
    return (
        <div className={cn('flex w-full flex-col space-y-1', wrapperClassName)}>
            {label && (
                <Label
                    htmlFor={name}
                    className={cn(
                        'w-fit',
                        readOnly ? 'pointer-events-none opacity-75' : 'cursor-pointer',
                    )}
                >
                    {label}
                </Label>
            )}
            {children}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
