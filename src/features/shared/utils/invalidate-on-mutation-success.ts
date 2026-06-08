import type { TagDescription } from '@reduxjs/toolkit/query';

import { api } from '@/services/BaseApiService';

type ApiTag = TagDescription<'Auth' | 'Users' | 'Teams' | 'Tasks' | 'Analytics'>;

type TagsFactory<TArg, TTags extends readonly ApiTag[]> = (result: unknown, arg: TArg) => TTags;

type MutationLifecycleApi = {
    dispatch: (action: unknown) => unknown;
    queryFulfilled: Promise<{ data: unknown }>;
};

export function invalidateOnMutationSuccess<TArg, TTags extends readonly ApiTag[]>(
    tags: TTags | TagsFactory<TArg, TTags>,
) {
    return async (arg: TArg, { dispatch, queryFulfilled }: MutationLifecycleApi) => {
        try {
            const { data } = await queryFulfilled;
            const tagsToInvalidate = typeof tags === 'function' ? tags(data, arg) : tags;
            dispatch(api.util.invalidateTags([...tagsToInvalidate]));
        } catch {
            // Skip cache invalidation when the mutation fails.
        }
    };
}
