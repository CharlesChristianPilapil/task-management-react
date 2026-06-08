import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { InputField, SelectField } from '@/components/Fields';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { User } from '@/features/auth';
import { handleFormApiError } from '@/features/shared/utils/apply-api-errors-to-form';

import { UPDATE_USER_SCHEMA, type UpdateUserFormValues } from '../_schema/index.schema';
import { useUpdateUserMutation } from '../_service/user.service';
import { getAssignableRoles, USER_ROLE_LABELS } from '../_utils';

type EditUserDialogProps = {
    open: boolean;
    user: User | null;
    actor: User | null | undefined;
    onClose: () => void;
};

export function EditUserDialog({ open, user, actor, onClose }: EditUserDialogProps) {
    const assignableRoles = getAssignableRoles(actor);
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isDirty },
    } = useForm<UpdateUserFormValues>({
        resolver: zodResolver(UPDATE_USER_SCHEMA),
        defaultValues: {
            name: '',
            email: '',
            role: 'team_member',
        },
    });

    useEffect(() => {
        if (open && user) {
            reset({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
    }, [open, reset, user]);

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        reset();
        onClose();
    };

    const onSubmit = async (values: UpdateUserFormValues) => {
        if (!user) {
            return;
        }

        const toastId = toast.loading('Saving changes...');

        try {
            await updateUser({
                userId: user.id,
                payload: {
                    name: values.name.trim(),
                    email: values.email.trim(),
                    role: values.role,
                },
            }).unwrap();
            toast.success('User updated', { id: toastId });
            onClose();
        } catch (error) {
            const { message } = handleFormApiError(error, setError, 'Failed to update user.');
            toast.error(message, { id: toastId });
        }
    };

    if (!user) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Edit user"
            description={`Update details for ${user.name}.`}
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
                            <Button type="submit" disabled={!isDirty}>
                                {isLoading ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </Dialog>
    );
}
