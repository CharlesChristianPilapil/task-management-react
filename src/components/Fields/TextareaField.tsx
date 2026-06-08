import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { FieldWrapper } from '@/components/Fields/FieldWrapper';
import { textareaControlClassName } from '@/components/Fields/field-styles';
import { cn } from '@/lib/utils';

export type TextareaFieldProps = {
    label?: string;
    error?: string;
    wrapperClassName?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
    ({ label, error, wrapperClassName, className, name, id, ...props }, ref) => {
        const fieldId = id ?? name;

        return (
            <FieldWrapper
                label={label}
                name={fieldId}
                error={error}
                wrapperClassName={wrapperClassName}
            >
                <textarea
                    {...props}
                    ref={ref}
                    id={fieldId}
                    name={name}
                    aria-invalid={!!error}
                    className={cn(textareaControlClassName, className)}
                />
            </FieldWrapper>
        );
    },
);

TextareaField.displayName = 'TextareaField';

export default TextareaField;
