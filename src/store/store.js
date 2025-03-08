import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import authReducer from './authSlice';
import weatherReducer from './weatherSlice';
import themeReducer from './themeSlice'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
        weather: weatherReducer,
        theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});