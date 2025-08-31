import { taskApi } from './api';
import type { Task, CreateTaskRequest, TaskSearchParams, PaginatedResponse, Category } from '../types';

class TaskService {
  // Task CRUD operations
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response = await taskApi.post('/tasks', taskData);
    return response.data;
  }

  async getTaskById(id: number): Promise<Task> {
    const response = await taskApi.get(`/tasks/${id}`);
    return response.data;
  }

  async updateTask(id: number, taskData: Partial<CreateTaskRequest>): Promise<Task> {
    const response = await taskApi.put(`/tasks/${id}`, taskData);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await taskApi.delete(`/tasks/${id}`);
  }

  // Task management
  async publishTask(id: number): Promise<Task> {
    const response = await taskApi.patch(`/tasks/${id}/publish`);
    return response.data;
  }

  async assignTask(id: number, taskerId: number): Promise<Task> {
    const response = await taskApi.patch(`/tasks/${id}/assign?taskerId=${taskerId}`);
    return response.data;
  }

  async completeTask(id: number): Promise<Task> {
    const response = await taskApi.patch(`/tasks/${id}/complete`);
    return response.data;
  }

  async cancelTask(id: number): Promise<Task> {
    const response = await taskApi.patch(`/tasks/${id}/cancel`);
    return response.data;
  }

  // Task queries
  async getMyTasks(params?: TaskSearchParams): Promise<PaginatedResponse<Task>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/tasks/my-tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await taskApi.get(url);
    return response.data;
  }

  async getMyAssignments(params?: TaskSearchParams): Promise<PaginatedResponse<Task>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/tasks/my-assignments${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await taskApi.get(url);
    return response.data;
  }

  async searchTasks(params?: TaskSearchParams): Promise<PaginatedResponse<Task>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `/tasks/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await taskApi.get(url);
    return response.data;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await taskApi.get('/categories');
    return response.data;
  }

  async getActiveCategories(): Promise<Category[]> {
    const response = await taskApi.get('/categories/active');
    return response.data;
  }

  // Task images
  async uploadTaskImage(taskId: number, imageFile: File): Promise<void> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    await taskApi.post(`/tasks/${taskId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadTaskPhotos(taskId: number, photos: File[]): Promise<Task> {
    const formData = new FormData();
    photos.forEach((photo) => {
      formData.append(`photos`, photo);
    });
    
    const response = await taskApi.post(`/tasks/${taskId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async setPrimaryImage(taskId: number, imageId: number): Promise<void> {
    await taskApi.patch(`/tasks/${taskId}/images/${imageId}/set-primary`);
  }

  async deleteTaskImage(taskId: number, imageId: number): Promise<void> {
    await taskApi.delete(`/tasks/${taskId}/images/${imageId}`);
  }
}

export const taskService = new TaskService();
