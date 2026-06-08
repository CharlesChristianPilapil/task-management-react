import { z } from 'zod';

import { EMAIL_FIELD, PASSWORD_FIELD } from '@/features/shared/_schema/index.schema';

export const LOGIN_SCHEMA = z.object({
    email: EMAIL_FIELD,
    password: PASSWORD_FIELD,
});

export type LoginFormValues = z.infer<typeof LOGIN_SCHEMA>;
