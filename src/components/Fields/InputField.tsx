import { forwardRef, type InputHTMLAttributes } from 'react';

import { FieldWrapper } from '@/components/Fields/FieldWrapper';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type InputFieldProps = {
    label?: string;
    error?: string;
    wrapperClassName?: string;
    type?: Exclude<InputHTMLAttributes<HTMLInputElement>['type'], 'password'>;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, wrapperClassName, className, readOnly, ...props }, ref) => {
        return (
            <FieldWrapper
                label={label}
                name={props.name}
                error={error}
                readOnly={readOnly}
                wrapperClassName={wrapperClassName}
            >
                <Input
                    {...props}
                    ref={ref}
                    id={props.name}
                    readOnly={readOnly}
                    aria-invalid={!!error}
                    className={cn(readOnly && 'text-muted-foreground', className)}
                />
            </FieldWrapper>
        );
    },
);

InputField.displayName = 'InputField';

export default InputField;
