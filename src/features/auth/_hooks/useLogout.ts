import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { ROUTES } from '@/config/routes';
import { storage } from '@/features/shared/utils';
import { logout as logoutAction } from '@/slices/authSlice';
import type { AppDispatch } from '@/store';

import { useLogoutMutation } from '../_service';

const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'data' in error) {
        const data = (error as { data?: { message?: string } }).data;
        if (data?.message) {
            return data.message;
        }
    }

    return 'Something went wrong. Please try again.';
};

export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [logoutMutation, { isLoading }] = useLogoutMutation();

    const logout = async () => {
        const toastId = toast.loading('Logging out...');

        try {
            await logoutMutation().unwrap();
            toast.success('Logged out successfully', { id: toastId });
        } catch (error) {
            toast.error(getErrorMessage(error), { id: toastId });
        } finally {
            storage.removeToken();
            dispatch(logoutAction());
            navigate(ROUTES.LOGIN, { replace: true });
        }
    };

    return { logout, isLoading };
};
