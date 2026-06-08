import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { InputField } from '@/components/Fields';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { handleFormApiError } from '@/features/shared/utils/apply-api-errors-to-form';

import { CREATE_TEAM_SCHEMA, type CreateTeamFormValues } from '../_schema/index.schema';
import { useCreateTeamMutation } from '../_service/team.service';

type AddTeamDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function AddTeamDialog({ open, onClose }: AddTeamDialogProps) {
    const [createTeam, { isLoading }] = useCreateTeamMutation();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CreateTeamFormValues>({
        resolver: zodResolver(CREATE_TEAM_SCHEMA),
        defaultValues: {
            name: '',
        },
    });

    const handleClose = () => {
        if (isLoading) {
            return;
        }

        reset();
        onClose();
    };

    const onSubmit = async (values: CreateTeamFormValues) => {
        const toastId = toast.loading('Creating team...');

        try {
            await createTeam({ name: values.name.trim() }).unwrap();
            toast.success('Team created', { id: toastId });
            reset();
            onClose();
        } catch (error) {
            const { message } = handleFormApiError(error, setError, 'Failed to create team.');
            toast.error(message, { id: toastId });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Add team"
            description="Create a new team. You will be added as the team lead."
            closeDisabled={isLoading}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <fieldset disabled={isLoading}>
                    <div className="flex flex-col gap-4">
                        <InputField
                            label="Team name"
                            placeholder="Enter team name"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isLoading}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">{isLoading ? 'Creating...' : 'Create team'}</Button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </Dialog>
    );
}
