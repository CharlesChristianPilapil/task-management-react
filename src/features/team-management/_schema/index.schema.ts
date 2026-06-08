import { z } from 'zod';

export const CREATE_TASK_SCHEMA = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required.')
        .max(255, 'Title must be at most 255 characters.'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high'], {
        error: 'Priority is required.',
    }),
    assigned_to: z.string().optional(),
    due_date: z.string().optional(),
});

export type CreateTaskFormValues = z.infer<typeof CREATE_TASK_SCHEMA>;

export const ADD_MEMBER_SCHEMA = z.object({
    user_id: z.string().min(1, 'Select a user.'),
    role: z.enum(['member', 'lead']).optional(),
});

export type AddMemberFormValues = z.infer<typeof ADD_MEMBER_SCHEMA>;

export const CREATE_TEAM_SCHEMA = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Team name is required.')
        .max(255, 'Team name must be at most 255 characters.'),
});

export type CreateTeamFormValues = z.infer<typeof CREATE_TEAM_SCHEMA>;
