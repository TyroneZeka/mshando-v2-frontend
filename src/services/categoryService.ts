import { taskApi } from './api';
import type { Category, CreateCategoryRequest } from '../types';

class CategoryService {
  // Get all categories (admin only)
  async getAllCategories(): Promise<Category[]> {
    const response = await taskApi.get('/categories');
    return response.data;
  }

  // Get active categories (public)
  async getActiveCategories(): Promise<Category[]> {
    const response = await taskApi.get('/categories/active');
    return response.data;
  }

  // Create new category (admin only)
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    const response = await taskApi.post('/categories', categoryData);
    return response.data;
  }

  // Update category (admin only)
  async updateCategory(id: number, categoryData: Partial<CreateCategoryRequest>): Promise<Category> {
    const response = await taskApi.put(`/categories/${id}`, categoryData);
    return response.data;
  }

  // Activate category (admin only)
  async activateCategory(id: number): Promise<Category> {
    const response = await taskApi.patch(`/categories/${id}/activate`);
    return response.data;
  }

  // Deactivate category (admin only)
  async deactivateCategory(id: number): Promise<Category> {
    const response = await taskApi.patch(`/categories/${id}/deactivate`);
    return response.data;
  }

  // Delete category (admin only)
  async deleteCategory(id: number): Promise<void> {
    await taskApi.delete(`/categories/${id}`);
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<Category> {
    const response = await taskApi.get(`/categories/${id}`);
    return response.data;
  }

  // Search categories (admin)
  async searchCategories(params?: {
    name?: string;
    active?: boolean;
    page?: number;
    size?: number;
  }): Promise<{
    content: Category[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.name) queryParams.append('name', params.name);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());

    const response = await taskApi.get(`/categories/search?${queryParams.toString()}`);
    return response.data;
  }
}

export const categoryService = new CategoryService();
