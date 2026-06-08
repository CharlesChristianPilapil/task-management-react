import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SelectField } from '@/components/Fields';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { User } from '@/features/auth';
import { getApiErrorMessage } from '@/features/shared/utils/get-api-error-message';

import { ADD_MEMBER_SCHEMA, type AddMemberFormValues } from '../_schema/index.schema';
import { useAddTeamMemberMutation } from '../_service/team.service';
import type { Team, TeamMember } from '../_types';

type AddMemberDialogProps = {
    open: boolean;
    team: Team;
    members: TeamMember[];
    users: User[];
    onClose: () => void;
};

export function AddMemberDialog({
    open,
    team,
    members,
    users,
    onClose,
}: AddMemberDialogProps) {
    const [addMember, { isLoading }] = useAddTeamMemberMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<AddMemberFormValues>({
        resolver: zodResolver(ADD_MEMBER_SCHEMA),
        defaultValues: {
            user_id: '',
            role: 'member',
        },
    });

    const memberIds = new Set(members.map((member) => member.id));
    const availableUsers = (Array.isArray(users) ? users : []).filter(
        (user) => !memberIds.has(user.id),
    );

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        reset();
        onClose();
    };

    const onSubmit = async (values: AddMemberFormValues) => {
        const toastId = toast.loading('Adding member...');

        try {
            await addMember({
                teamId: team.id,
                payload: {
                    user_id: Number(values.user_id),
                    role: values.role,
                },
            }).unwrap();

            toast.success('Member added', { id: toastId });
            reset();
            onClose();
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to add member.'), { id: toastId });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Add member"
            description={`Add a user to ${team.name}.`}
            closeDisabled={isLoading}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <fieldset disabled={isLoading}>
                    <div className="flex flex-col gap-4">
                        <SelectField
                            label="User"
                            error={errors.user_id?.message}
                            {...register('user_id')}
                        >
                            <option value="">Select a user</option>
                            {availableUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </SelectField>

                        <SelectField
                            label="Role"
                            error={errors.role?.message}
                            {...register('role')}
                        >
                            <option value="member">Member</option>
                            <option value="lead">Lead</option>
                        </SelectField>

                        {availableUsers.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                All users are already members of this team.
                            </p>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={availableUsers.length === 0 || !isDirty}>
                                {isLoading ? 'Adding...' : 'Add member'}
                            </Button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </Dialog>
    );
}
