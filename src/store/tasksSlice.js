import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load tasks from localStorage
export const loadTasks = createAsyncThunk(
    'tasks/loadTasks',
    async(userId) => {
        const storedTasks = localStorage.getItem(`tasks_${userId}`);
        return storedTasks ? JSON.parse(storedTasks) : [];
    }
);

// Save tasks to localStorage
const saveTasks = (tasks, userId) => {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {
        addTask: (state, action) => {
            const newTask = {
                id: Date.now().toString(),
                text: action.payload.text,
                completed: false,
                priority: action.payload.priority || 'medium',
                createdAt: new Date().toISOString(),
                starred: false,
                dueDate: action.payload.dueDate || null,
            };
            state.tasks.push(newTask);
            saveTasks(state.tasks, action.payload.userId);
        },
        toggleComplete: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task) {
                task.completed = !task.completed;
                saveTasks(state.tasks, action.payload.userId);
            }
        },
        toggleStar: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task) {
                task.starred = !task.starred;
                saveTasks(state.tasks, action.payload.userId);
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload.id);
            saveTasks(state.tasks, action.payload.userId);
        },
        updateTaskPriority: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task) {
                task.priority = action.payload.priority;
                saveTasks(state.tasks, action.payload.userId);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(loadTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    addTask,
    toggleComplete,
    toggleStar,
    deleteTask,
    updateTaskPriority
} = tasksSlice.actions;

export default tasksSlice.reducer;