import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@/features/auth';

const USER_KEY = 'auth_user';

const userJson = localStorage.getItem(USER_KEY);

const initialState = {
    user: userJson ? (JSON.parse(userJson) as User) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem(USER_KEY);
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
