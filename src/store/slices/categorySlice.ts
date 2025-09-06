import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryService } from '../../services/categoryService';
import { handleApiError } from '../../services/api';
import type { RootState } from '../index';
import type { Category, CreateCategoryRequest } from '../../types';

interface CategoryState {
  categories: Category[];
  searchResults: {
    content: Category[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  } | null;
  currentCategory: Category | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  searchResults: null,
  currentCategory: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
};

// Async thunks
export const getAllCategoriesAsync = createAsyncThunk(
  'categories/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getAllCategories();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getActiveCategoriesAsync = createAsyncThunk(
  'categories/getActiveCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getActiveCategories();
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const searchCategoriesAsync = createAsyncThunk(
  'categories/searchCategories',
  async (params: {
    name?: string;
    active?: boolean;
    page?: number;
    size?: number;
  }, { rejectWithValue }) => {
    try {
      return await categoryService.searchCategories(params);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createCategoryAsync = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: CreateCategoryRequest, { rejectWithValue }) => {
    try {
      return await categoryService.createCategory(categoryData);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }: { id: number; categoryData: Partial<CreateCategoryRequest> }, { rejectWithValue }) => {
    try {
      return await categoryService.updateCategory(id, categoryData);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const activateCategoryAsync = createAsyncThunk(
  'categories/activateCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      return await categoryService.activateCategory(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deactivateCategoryAsync = createAsyncThunk(
  'categories/deactivateCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      return await categoryService.deactivateCategory(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getCategoryByIdAsync = createAsyncThunk(
  'categories/getCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await categoryService.getCategoryById(id);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
  },
  extraReducers: (builder) => {
    // Get all categories
    builder
      .addCase(getAllCategoriesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategoriesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategoriesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get active categories
    builder
      .addCase(getActiveCategoriesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getActiveCategoriesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getActiveCategoriesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search categories
    builder
      .addCase(searchCategoriesAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCategoriesAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchCategoriesAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create category
    builder
      .addCase(createCategoryAsync.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.isCreating = false;
        state.categories.unshift(action.payload);
        state.currentCategory = action.payload;
      })
      .addCase(createCategoryAsync.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update category
    builder
      .addCase(updateCategoryAsync.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        // Update search results if they exist
        if (state.searchResults) {
          const searchIndex = state.searchResults.content.findIndex(cat => cat.id === action.payload.id);
          if (searchIndex !== -1) {
            state.searchResults.content[searchIndex] = action.payload;
          }
        }
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Activate category
    builder
      .addCase(activateCategoryAsync.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        // Update search results if they exist
        if (state.searchResults) {
          const searchIndex = state.searchResults.content.findIndex(cat => cat.id === action.payload.id);
          if (searchIndex !== -1) {
            state.searchResults.content[searchIndex] = action.payload;
          }
        }
      });

    // Deactivate category
    builder
      .addCase(deactivateCategoryAsync.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
        // Update search results if they exist
        if (state.searchResults) {
          const searchIndex = state.searchResults.content.findIndex(cat => cat.id === action.payload.id);
          if (searchIndex !== -1) {
            state.searchResults.content[searchIndex] = action.payload;
          }
        }
      });

    // Delete category
    builder
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        if (state.currentCategory?.id === action.payload) {
          state.currentCategory = null;
        }
        // Update search results if they exist
        if (state.searchResults) {
          state.searchResults.content = state.searchResults.content.filter(cat => cat.id !== action.payload);
          state.searchResults.totalElements -= 1;
        }
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get category by ID
    builder
      .addCase(getCategoryByIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload;
      })
      .addCase(getCategoryByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentCategory, clearSearchResults } = categorySlice.actions;

// Selectors
export const selectCategories = (state: RootState) => state.categories;
export const selectCategoriesList = (state: RootState) => state.categories.categories;
export const selectCategoriesSearchResults = (state: RootState) => state.categories.searchResults;
export const selectCurrentCategory = (state: RootState) => state.categories.currentCategory;
export const selectCategoriesLoading = (state: RootState) => state.categories.isLoading;
export const selectCategoriesCreating = (state: RootState) => state.categories.isCreating;
export const selectCategoriesUpdating = (state: RootState) => state.categories.isUpdating;
export const selectCategoriesError = (state: RootState) => state.categories.error;

export default categorySlice.reducer;
