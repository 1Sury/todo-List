import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async({ username, password }, { rejectWithValue }) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (username === 'demo' && password === 'password') {
                const user = { id: 1, username, name: 'Demo User' };
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            } else {
                return rejectWithValue('Invalid username or password');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async() => {
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.removeItem('user');
        return null;
    }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            // Check auth status
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;