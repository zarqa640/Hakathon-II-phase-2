/**
 * API Client for the Todo Application
 *
 * This module provides functions to interact with the backend API.
 */

import { User } from '@/context/auth';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Generic request function
const request = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  // Handle different response types
  const contentType = response.headers.get('content-type');
  let data;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(data.message || `API request failed: ${response.status}`);
  }

  return data;
};

// Authentication API functions
export const authAPI = {
  // Register a new user
  register: async (userData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Logout user
  logout: async (token: string) => {
    return request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get user profile
  getProfile: async (token: string) => {
    return request('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  updateProfile: async (token: string, profileData: Partial<User>) => {
    return request('/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },
};

// Task API functions
export const taskAPI = {
  // Get all tasks for the current user
  getAll: async (token: string) => {
    return request('/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get a specific task by ID
  getById: async (taskId: number, token: string) => {
    return request(`/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Create a new task
  create: async (taskData: { title: string; description?: string; due_date?: string }, token: string) => {
    return request('/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
  },

  // Update a task
  update: async (taskId: number, taskData: Partial<{ title: string; description?: string; is_completed: boolean; due_date?: string }>, token: string) => {
    return request(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
  },

  // Delete a task
  delete: async (taskId: number, token: string) => {
    return request(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Export the base API client
export default {
  auth: authAPI,
  task: taskAPI,
  healthCheck,
};