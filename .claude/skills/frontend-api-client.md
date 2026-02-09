---
name: frontend-api-client
version: "1.0"
author: Claude Code
category: frontend
tags: [api, http, jwt, authentication]
---

# Frontend API Client Skill

## Purpose

This skill defines the pattern for centralized API communication in frontend applications. It ensures consistent handling of API requests, automatic attachment of JWT authentication tokens, and proper handling of unauthorized responses to maintain secure and reliable communication with backend services.

## Rules

### Centralized Client Pattern
- Create a single API client instance to handle all HTTP requests
- Configure base URL, default headers, and interceptors in one location
- Implement reusable request/response interceptors for common operations
- Maintain consistent error handling across all API calls

### JWT Token Attachment
- Retrieve JWT token from browser storage (localStorage/sessionStorage) or auth context
- Attach token to Authorization header in format "Bearer {token}"
- Ensure token is attached to every API request automatically
- Refresh token if expired before sending request (if refresh mechanism exists)

### Unauthorized Response Handling
- Intercept 401 Unauthorized responses globally
- Redirect user to login page when authentication fails
- Clear stored JWT token to prevent further unauthorized requests
- Optionally trigger token refresh mechanism before redirecting

## API Call Pattern

### Client Configuration Example
```javascript
// api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Service Layer Example
```javascript
// services/taskService.js
import apiClient from '../api/client';

export const taskService = {
  // Get user's tasks
  getUserTasks: async (userId) => {
    const response = await apiClient.get(`/api/v1/users/${userId}/tasks`);
    return response.data;
  },

  // Create new task
  createTask: async (userId, taskData) => {
    const response = await apiClient.post(`/api/v1/users/${userId}/tasks`, taskData);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const response = await apiClient.patch(`/api/v1/tasks/${taskId}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await apiClient.delete(`/api/v1/tasks/${taskId}`);
    return response.data;
  },
};
```

## Agents That Use This Skill

- **nextjs-frontend-dev**: To implement centralized API clients in Next.js applications
- **auth-system-architect**: To ensure proper JWT token handling in frontend authentication
- **fastapi-backend-dev**: To understand frontend API consumption patterns
- **database-agent**: To understand how frontend data access patterns relate to backend design