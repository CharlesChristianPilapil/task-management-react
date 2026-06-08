import { useDispatch, useSelector } from 'react-redux';

import type { User } from '@/features/auth';
import { storage } from '@/features/shared/utils/storage';
import { setCredentials, logout as logoutAction } from '@/slices/authSlice';
import type { AppDispatch, RootState } from '@/store';

const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    const login = (userData: User) => {
        dispatch(setCredentials(userData));
    };

    const logout = () => {
        storage.removeToken();
        dispatch(logoutAction());
    };

    return {
        user,
        login,
        logout,
        isAuthenticated: !!user,
    };
};

export default useAuth;
