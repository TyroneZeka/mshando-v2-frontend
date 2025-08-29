import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/taskService';
import type { Task, CreateTaskRequest, TaskSearchParams, PaginatedResponse, Category } from '../../types';
import type { RootState } from '../index';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  categories: Category[];
  searchResults: PaginatedResponse<Task> | null;
  myTasks: PaginatedResponse<Task> | null;
  myAssignments: PaginatedResponse<Task> | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  categories: [],
  searchResults: null,
  myTasks: null,
  myAssignments: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
};

// Async thunks
export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (taskData: CreateTaskRequest, { rejectWithValue }) => {
    try {
      const task = await taskService.createTask(taskData);
      return task;
    } catch {
      return rejectWithValue('Failed to create task');
    }
  }
);

export const getTaskByIdAsync = createAsyncThunk(
  'tasks/getTaskById',
  async (id: number, { rejectWithValue }) => {
    try {
      const task = await taskService.getTaskById(id);
      return task;
    } catch {
      return rejectWithValue('Failed to fetch task');
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }: { id: number; taskData: Partial<CreateTaskRequest> }, { rejectWithValue }) => {
    try {
      const task = await taskService.updateTask(id, taskData);
      return task;
    } catch {
      return rejectWithValue('Failed to update task');
    }
  }
);

export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (id: number, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch {
      return rejectWithValue('Failed to delete task');
    }
  }
);

export const publishTaskAsync = createAsyncThunk(
  'tasks/publishTask',
  async (id: number, { rejectWithValue }) => {
    try {
      const task = await taskService.publishTask(id);
      return task;
    } catch {
      return rejectWithValue('Failed to publish task');
    }
  }
);

export const getMyTasksAsync = createAsyncThunk(
  'tasks/getMyTasks',
  async (params: TaskSearchParams | undefined, { rejectWithValue }) => {
    try {
      const result = await taskService.getMyTasks(params);
      return result;
    } catch {
      return rejectWithValue('Failed to fetch your tasks');
    }
  }
);

export const getMyAssignmentsAsync = createAsyncThunk(
  'tasks/getMyAssignments',
  async (params: TaskSearchParams | undefined, { rejectWithValue }) => {
    try {
      const result = await taskService.getMyAssignments(params);
      return result;
    } catch {
      return rejectWithValue('Failed to fetch your assignments');
    }
  }
);

export const searchTasksAsync = createAsyncThunk(
  'tasks/searchTasks',
  async (params: TaskSearchParams | undefined, { rejectWithValue }) => {
    try {
      const result = await taskService.searchTasks(params);
      return result;
    } catch {
      return rejectWithValue('Failed to search tasks');
    }
  }
);

export const getCategoriesAsync = createAsyncThunk(
  'tasks/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const categories = await taskService.getActiveCategories();
      return categories;
    } catch {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
  },
  extraReducers: (builder) => {
    // Create task
    builder
      .addCase(createTaskAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        state.tasks.unshift(action.payload);
        state.currentTask = action.payload;
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Get task by ID
    builder
      .addCase(getTaskByIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTaskByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(getTaskByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTaskAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete task
    builder
      .addCase(deleteTaskAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Publish task
    builder
      .addCase(publishTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      });

    // Get my tasks
    builder
      .addCase(getMyTasksAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyTasksAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myTasks = action.payload;
      })
      .addCase(getMyTasksAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get my assignments
    builder
      .addCase(getMyAssignmentsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyAssignmentsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAssignments = action.payload;
      })
      .addCase(getMyAssignmentsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search tasks
    builder
      .addCase(searchTasksAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchTasksAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchTasksAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get categories
    builder
      .addCase(getCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearError, clearCurrentTask, clearSearchResults } = taskSlice.actions;

// Selectors
export const selectTasks = (state: RootState) => state.tasks;
export const selectTasksList = (state: RootState) => state.tasks.tasks;
export const selectCurrentTask = (state: RootState) => state.tasks.currentTask;
export const selectCategories = (state: RootState) => state.tasks.categories;
export const selectSearchResults = (state: RootState) => state.tasks.searchResults;
export const selectMyTasks = (state: RootState) => state.tasks.myTasks;
export const selectMyAssignments = (state: RootState) => state.tasks.myAssignments;
export const selectTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectTasksCreating = (state: RootState) => state.tasks.isCreating;
export const selectTasksUpdating = (state: RootState) => state.tasks.isUpdating;
export const selectTasksError = (state: RootState) => state.tasks.error;

export default taskSlice.reducer;
