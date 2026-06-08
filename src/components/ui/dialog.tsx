import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DialogProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
    closeDisabled?: boolean;
};

export function Dialog({
    open,
    onClose,
    title,
    description,
    children,
    className,
    closeDisabled = false,
}: DialogProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !closeDisabled) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose, closeDisabled]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                className={cn(
                    'relative z-10 w-full max-w-lg rounded-xl border border-border bg-background shadow-lg',
                    className,
                )}
            >
                <div className="flex items-start justify-between gap-4 border-b border-border p-4">
                    <div className="min-w-0">
                        <h2 id="dialog-title" className="text-lg font-semibold">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Close dialog"
                        disabled={closeDisabled}
                        onClick={onClose}
                    >
                        <X />
                    </Button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
