---
name: task-crud
version: "1.0"
author: Claude Code
category: web-application
tags: [todo, crud, authentication]
---

# Task CRUD Operations Skill

## Purpose

This skill defines the standard Create, Read, Update, Delete, and Complete operations for a Todo web application. It ensures that users can only access and modify their own tasks, maintaining proper data isolation and authentication.

## Step-by-Step Process

### Create Task
1. Verify user authentication and retrieve user ID from JWT token
2. Validate task input data (title, description, due date, priority, etc.)
3. Insert new task record with associated user ID
4. Return created task object with confirmation

### Read Tasks
1. Verify user authentication and retrieve user ID
2. Query database for tasks belonging to the authenticated user
3. Apply filters if specified (completed, pending, due date range, etc.)
4. Return filtered list of user's tasks

### Update Task
1. Verify user authentication and retrieve user ID
2. Validate that the task belongs to the authenticated user
3. Update specified task fields with new values
4. Return updated task object

### Delete Task
1. Verify user authentication and retrieve user ID
2. Validate that the task belongs to the authenticated user
3. Remove task record from database
4. Return confirmation of deletion

### Complete Task
1. Verify user authentication and retrieve user ID
2. Validate that the task belongs to the authenticated user
3. Update task's completion status
4. Return updated task object

## Constraints

- **User Isolation**: Users can only access, modify, or delete tasks that belong to them
- **Authentication Required**: All operations require a valid JWT token
- **Data Validation**: All input data must be validated before processing
- **Permission Checks**: System must verify user ownership before allowing modifications
- **Audit Trail**: Changes should be logged for security and debugging purposes

## Agents That Will Use This Skill

- **nextjs-frontend-dev**: To implement UI components for task management
- **fastapi-backend-dev**: To create secure API endpoints for task operations
- **database-agent**: To design proper database schema with user-task relationships
- **auth-system-architect**: To ensure proper authentication and authorization flows