import { z } from 'zod';

const userRoleSchema = z.enum(['admin', 'manager', 'team_member'], {
    error: 'Role is required.',
});

export const CREATE_USER_SCHEMA = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required.')
        .max(255, 'Name must be at most 255 characters.'),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required.')
        .email('Enter a valid email address.')
        .max(255, 'Email must be at most 255 characters.'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters.'),
    role: userRoleSchema,
});

export type CreateUserFormValues = z.infer<typeof CREATE_USER_SCHEMA>;

export const UPDATE_USER_SCHEMA = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required.')
        .max(255, 'Name must be at most 255 characters.'),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required.')
        .email('Enter a valid email address.')
        .max(255, 'Email must be at most 255 characters.'),
    role: userRoleSchema,
});

export type UpdateUserFormValues = z.infer<typeof UPDATE_USER_SCHEMA>;
