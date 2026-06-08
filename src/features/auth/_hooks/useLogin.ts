import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { ROUTES } from '@/config/routes';
import { storage } from '@/features/shared/utils';
import { useLoginMutation } from '../_service';
import { setCredentials } from '@/slices/authSlice';
import type { AppDispatch } from '@/store';

import type { LoginFormValues } from '../_schema/index.schema';

const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'data' in error) {
        const data = (error as { data?: { message?: string } }).data;
        if (data?.message) {
            return data.message;
        }
    }

    return 'Something went wrong. Please try again.';
};

export const useLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [loginMutation, { isLoading }] = useLoginMutation();

    const login = async (values: LoginFormValues) => {
        const toastId = toast.loading('Logging in...');

        try {
            const { user, access_token } = await loginMutation(values).unwrap();

            storage.setToken(access_token);
            dispatch(setCredentials(user));
            navigate(ROUTES.DASHBOARD, { replace: true });
            toast.success('Logged in successfully', { id: toastId });
        } catch (error) {
            toast.error(getErrorMessage(error), { id: toastId });
        }
    };

    return { login, isLoading };
};
