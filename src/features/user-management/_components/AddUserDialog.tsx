import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { InputField, PasswordField, SelectField } from '@/components/Fields';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { User } from '@/features/auth';
import { handleFormApiError } from '@/features/shared/utils/apply-api-errors-to-form';

import { CREATE_USER_SCHEMA, type CreateUserFormValues } from '../_schema/index.schema';
import { useCreateUserMutation } from '../_service';
import { getAssignableRoles, USER_ROLE_LABELS } from '../_utils';

type AddUserDialogProps = {
    open: boolean;
    actor: User | null | undefined;
    onClose: () => void;
};

export function AddUserDialog({ open, actor, onClose }: AddUserDialogProps) {
    const assignableRoles = getAssignableRoles(actor);
    const defaultRole = assignableRoles[0] ?? 'team_member';
    const [createUser, { isLoading }] = useCreateUserMutation();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(CREATE_USER_SCHEMA),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: defaultRole,
        },
    });

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        reset({
            name: '',
            email: '',
            password: '',
            role: defaultRole,
        });
        onClose();
    };

    const onSubmit = async (values: CreateUserFormValues) => {
        const toastId = toast.loading('Creating user...');

        try {
            await createUser({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
                role: values.role,
            }).unwrap();
            toast.success('User created', { id: toastId });
            reset({
                name: '',
                email: '',
                password: '',
                role: defaultRole,
            });
            onClose();
        } catch (error) {
            const { message } = handleFormApiError(error, setError, 'Failed to create user.');
            toast.error(message, { id: toastId });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Add user"
            description="Create a new user account. Password must be at least 8 characters."
            closeDisabled={isLoading}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <fieldset disabled={isLoading}>
                    <div className="flex flex-col gap-4">
                        <InputField
                            label="Name"
                            placeholder="Enter full name"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            placeholder="user@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <PasswordField
                            label="Password"
                            placeholder="At least 8 characters"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <SelectField
                            label="Role"
                            error={errors.role?.message}
                            disabled={assignableRoles.length <= 1}
                            {...register('role')}
                        >
                            {assignableRoles.map((role) => (
                                <option key={role} value={role}>
                                    {USER_ROLE_LABELS[role]}
                                </option>
                            ))}
                        </SelectField>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">{isLoading ? 'Creating...' : 'Create user'}</Button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </Dialog>
    );
}
