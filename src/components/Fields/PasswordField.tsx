import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useEffect, useState, type InputHTMLAttributes } from 'react';

import { FieldWrapper } from '@/components/Fields/FieldWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type PasswordFieldProps = {
    label?: string;
    error?: string;
    wrapperClassName?: string;
    hideOnReadOnly?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    (
        {
            label,
            error,
            wrapperClassName,
            hideOnReadOnly = true,
            className,
            readOnly,
            disabled,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = useState(false);

        useEffect(() => {
            if (hideOnReadOnly && readOnly) {
                setShowPassword(false);
            }
        }, [hideOnReadOnly, readOnly]);

        return (
            <FieldWrapper
                label={label}
                name={props.name}
                error={error}
                readOnly={readOnly}
                wrapperClassName={wrapperClassName}
            >
                <div className="relative">
                    <Input
                        {...props}
                        ref={ref}
                        id={props.name}
                        type={showPassword ? 'text' : 'password'}
                        readOnly={readOnly}
                        disabled={disabled}
                        aria-invalid={!!error}
                        className={cn('pr-9', className)}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={readOnly || disabled}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
            </FieldWrapper>
        );
    },
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
