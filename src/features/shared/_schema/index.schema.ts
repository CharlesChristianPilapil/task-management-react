import { z } from 'zod';

export const EMAIL_FIELD = z.email('Enter a valid email address.');

export const PASSWORD_FIELD = z.string().min(1, 'Password is required.');
