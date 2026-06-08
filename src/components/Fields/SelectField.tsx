import { forwardRef, type SelectHTMLAttributes } from 'react';

import { FieldWrapper } from '@/components/Fields/FieldWrapper';
import { fieldControlClassName } from '@/components/Fields/field-styles';
import { cn } from '@/lib/utils';

export type SelectFieldProps = {
    label?: string;
    error?: string;
    wrapperClassName?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, error, wrapperClassName, className, name, id, children, ...props }, ref) => {
        const fieldId = id ?? name;

        return (
            <FieldWrapper
                label={label}
                name={fieldId}
                error={error}
                wrapperClassName={wrapperClassName}
            >
                <select
                    {...props}
                    ref={ref}
                    id={fieldId}
                    name={name}
                    aria-invalid={!!error}
                    className={cn(fieldControlClassName, className)}
                >
                    {children}
                </select>
            </FieldWrapper>
        );
    },
);

SelectField.displayName = 'SelectField';

export default SelectField;
