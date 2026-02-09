---
name: rest-api-design
version: "1.0"
author: Claude Code
category: api-design
tags: [rest, api, http, json]
---

# REST API Design Skill

## Purpose

This skill defines the principles and practices for designing RESTful APIs that follow industry standards. It ensures consistent endpoint structures, proper HTTP method usage, standardized JSON request/response formats, and appropriate HTTP status code usage for predictable and maintainable APIs.

## Design Rules

### Endpoint Structure
- Use nouns instead of verbs in endpoint paths (e.g., `/users` instead of `/getUsers`)
- Use plural nouns for collections (e.g., `/tasks` instead of `/task`)
- Organize hierarchically with parent-child relationships (e.g., `/users/{id}/tasks`)
- Use kebab-case for multi-word resources (e.g., `/user-profiles`)
- Maintain consistent versioning in URLs (e.g., `/api/v1/users`)

### HTTP Methods Usage
- GET: Retrieve resources (safe and idempotent)
- POST: Create new resources or trigger actions
- PUT: Update entire resources (idempotent)
- PATCH: Partial updates to resources
- DELETE: Remove resources (idempotent)

### JSON Request/Response Standards
- Use camelCase for property names in JSON objects
- Include consistent metadata in responses (pagination, timestamps)
- Use UTC timezone for datetime fields with ISO 8601 format
- Implement consistent error response structure
- Support content negotiation with Accept and Content-Type headers

### HTTP Status Code Usage
- 200 OK: Successful GET, PUT, PATCH requests
- 201 Created: Successful POST requests with resource creation
- 204 No Content: Successful DELETE requests
- 400 Bad Request: Client error with malformed request
- 401 Unauthorized: Authentication required
- 403 Forbidden: Authorized user lacks permission
- 404 Not Found: Resource doesn't exist
- 422 Unprocessable Entity: Valid request but semantic errors
- 500 Internal Server Error: Server-side errors

## Example Endpoints

### User Management
```
GET    /api/v1/users          # List users (with pagination/filtering)
POST   /api/v1/users          # Create new user
GET    /api/v1/users/{id}     # Get specific user
PUT    /api/v1/users/{id}     # Update entire user
PATCH  /api/v1/users/{id}     # Partial user update
DELETE /api/v1/users/{id}     # Delete user
```

### Task Management (Child Resource)
```
GET    /api/v1/users/{userId}/tasks     # List user's tasks
POST   /api/v1/users/{userId}/tasks     # Create task for user
GET    /api/v1/tasks/{taskId}           # Get specific task
PUT    /api/v1/tasks/{taskId}           # Update entire task
PATCH  /api/v1/tasks/{taskId}           # Partial task update
DELETE /api/v1/tasks/{taskId}           # Delete task
```

### Example Request/Response
```json
// Request to create a task
{
  "title": "Complete project",
  "description": "Finish the API design",
  "dueDate": "2023-12-31T23:59:59Z",
  "priority": "high"
}

// Response after successful creation
{
  "id": "12345",
  "title": "Complete project",
  "description": "Finish the API design",
  "dueDate": "2023-12-31T23:59:59Z",
  "priority": "high",
  "createdAt": "2023-11-15T10:30:00Z",
  "updatedAt": "2023-11-15T10:30:00Z",
  "completed": false
}
```

## Agent Usage

- **fastapi-backend-dev**: To implement RESTful API endpoints following these standards
- **database-agent**: To design database schemas that support RESTful resource relationships
- **nextjs-frontend-dev**: To consume RESTful APIs with consistent request/response handling
- **auth-system-architect**: To secure REST endpoints with proper authentication and authorization