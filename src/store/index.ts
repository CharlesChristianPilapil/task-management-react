import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { api } from '@/services/BaseApiService';
import authReducer, { logout } from '@/slices/authSlice';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    actionCreator: logout,
    effect: (_action, listenerApi) => {
        listenerApi.dispatch(api.util.resetApiState());
    },
});

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
        .prepend(listenerMiddleware.middleware)
        .concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
