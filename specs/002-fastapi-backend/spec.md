# Feature Specification: Todo App Backend API

**Feature Branch**: `002-fastapi-backend`
**Created**: 2026-02-08
**Status**: Draft
**Input**: Backend API for Todo App Phase II - FastAPI server with JWT authentication connecting to existing Next.js frontend with Better Auth

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View My Tasks (Priority: P1)

As a logged-in user, I want to retrieve all my tasks so that I can see what I need to accomplish.

**Why this priority**: Core functionality - users must be able to view their tasks before they can manage them. This is the foundation of the entire todo application.

**Independent Test**: Can be fully tested by logging in via the frontend, then calling the tasks endpoint and verifying the response contains only the authenticated user's tasks.

**Acceptance Scenarios**:

1. **Given** a user is authenticated with a valid JWT token, **When** they request their task list, **Then** the system returns only tasks belonging to that user
2. **Given** a user is authenticated but has no tasks, **When** they request their task list, **Then** the system returns an empty list with a 200 status
3. **Given** a request has no authentication token, **When** the tasks endpoint is called, **Then** the system returns a 401 Unauthorized error

---

### User Story 2 - Create a New Task (Priority: P1)

As a logged-in user, I want to create a new task so that I can track work I need to complete.

**Why this priority**: Core functionality - task creation is essential for the todo app to have any value. Without this, users cannot use the application.

**Independent Test**: Can be fully tested by authenticating, submitting a new task with title and optional description, and verifying it appears in subsequent task list requests.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they submit a new task with a title, **Then** the task is created with the user's ID automatically assigned and returned with a 201 status
2. **Given** a user is authenticated, **When** they submit a task without a title, **Then** the system returns a 422 validation error
3. **Given** a user is authenticated, **When** they create a task with title and description, **Then** both fields are saved and the task defaults to not completed

---

### User Story 3 - Update an Existing Task (Priority: P2)

As a logged-in user, I want to update my tasks so that I can mark them complete or modify their details.

**Why this priority**: Important for task management lifecycle - users need to mark tasks as done and update task details as requirements change.

**Independent Test**: Can be fully tested by creating a task, then updating its title, description, or completion status and verifying the changes persist.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and owns a task, **When** they update the task's completed status to true, **Then** the task is marked as completed
2. **Given** a user is authenticated and owns a task, **When** they update the title or description, **Then** the changes are persisted
3. **Given** a user is authenticated, **When** they attempt to update a task they don't own, **Then** the system returns a 404 Not Found error (to avoid leaking information about other users' tasks)
4. **Given** a user is authenticated, **When** they attempt to update a non-existent task, **Then** the system returns a 404 Not Found error

---

### User Story 4 - Delete a Task (Priority: P2)

As a logged-in user, I want to delete tasks so that I can remove items I no longer need to track.

**Why this priority**: Completes the CRUD lifecycle - users need to clean up their task list by removing completed or irrelevant tasks.

**Independent Test**: Can be fully tested by creating a task, deleting it, and verifying it no longer appears in the task list.

**Acceptance Scenarios**:

1. **Given** a user is authenticated and owns a task, **When** they delete the task, **Then** the task is permanently removed and the system returns a 204 No Content status
2. **Given** a user is authenticated, **When** they attempt to delete a task they don't own, **Then** the system returns a 404 Not Found error
3. **Given** a user is authenticated, **When** they attempt to delete a non-existent task, **Then** the system returns a 404 Not Found error

---

### User Story 5 - Secure Cross-Origin Access (Priority: P1)

As the frontend application, I need to make authenticated requests to the backend from a different origin so that users can interact with their tasks through the web interface.

**Why this priority**: Critical infrastructure - without proper CORS configuration, the frontend cannot communicate with the backend at all.

**Independent Test**: Can be fully tested by making requests from the frontend origin and verifying responses include proper CORS headers.

**Acceptance Scenarios**:

1. **Given** a request originates from the allowed frontend origin, **When** the browser sends a preflight OPTIONS request, **Then** the server responds with appropriate CORS headers allowing the request
2. **Given** a request originates from an unauthorized origin, **When** the browser sends a request, **Then** the server denies the request via CORS policy
3. **Given** a request includes credentials (JWT token), **When** sent from the allowed origin, **Then** the request is processed with the token

---

### Edge Cases

- What happens when a JWT token is expired? → System returns 401 Unauthorized with clear error message
- What happens when a JWT token is malformed or tampered with? → System returns 401 Unauthorized
- What happens when database connection fails? → System returns 503 Service Unavailable with appropriate error
- What happens when task title exceeds maximum length? → System returns 422 with validation error
- What happens when concurrent requests update the same task? → Last write wins (standard behavior)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST verify JWT tokens issued by Better Auth using the shared secret
- **FR-002**: System MUST extract the user identifier from valid JWT tokens for request authorization
- **FR-003**: System MUST reject all requests without a valid Bearer token with 401 status
- **FR-004**: System MUST enforce user isolation - users can only access their own tasks
- **FR-005**: System MUST support creating tasks with required title and optional description
- **FR-006**: System MUST automatically assign the authenticated user's ID to new tasks
- **FR-007**: System MUST default new tasks to incomplete status (completed = false)
- **FR-008**: System MUST automatically record task creation timestamp
- **FR-009**: System MUST allow updating task title, description, and completion status
- **FR-010**: System MUST verify task ownership before allowing updates or deletes
- **FR-011**: System MUST permanently delete tasks (no soft delete)
- **FR-012**: System MUST allow cross-origin requests only from the configured frontend origin
- **FR-013**: System MUST connect to the existing shared database used by the frontend
- **FR-014**: System MUST return appropriate HTTP status codes (200, 201, 204, 400, 401, 404, 422, 500, 503)

### Key Entities

- **Task**: A unit of work tracked by a user
  - Unique identifier (auto-generated)
  - Owner reference (links to authenticated user)
  - Title (required, describes the task)
  - Description (optional, additional details)
  - Completion status (boolean, defaults to false)
  - Creation timestamp (auto-generated)

- **User**: The authenticated person using the system (managed by frontend/Better Auth)
  - Unique identifier (from JWT token)
  - Tasks ownership relationship (one user has many tasks)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated users can perform all CRUD operations on their tasks within 500ms response time under normal load
- **SC-002**: 100% of requests without valid authentication are rejected with 401 status
- **SC-003**: 100% of requests to access another user's tasks are denied (return 404)
- **SC-004**: Frontend can successfully communicate with backend via CORS without browser errors
- **SC-005**: System correctly validates all incoming data and returns appropriate error messages for invalid input
- **SC-006**: System maintains data integrity - tasks are correctly associated with their owners and persist across sessions

## Assumptions

- The frontend sends JWT tokens in the `Authorization: Bearer <token>` header format
- Better Auth uses a symmetric signing algorithm (HS256) for JWT tokens
- The `user_id` claim in the JWT token uniquely identifies the user
- The existing database schema (if any) from Better Auth will not conflict with the Tasks table
- The frontend origin is `http://localhost:3000` during development
- Task titles have a reasonable maximum length (assumed 255 characters)
- Task descriptions have a reasonable maximum length (assumed 2000 characters)

## Constraints

- Backend MUST NOT implement any login/signup logic - authentication is handled entirely by the frontend
- Backend MUST use the same database instance as the frontend
- Backend MUST NOT store or log the JWT secret in plain text in version control
- Backend MUST NOT expose internal error details in API responses (security)

## Dependencies

- **Better Auth (Frontend)**: Provides JWT tokens for authentication
- **Neon PostgreSQL Database**: Shared data store between frontend and backend
- **Frontend Application**: Consumer of the API endpoints

## Out of Scope

- User registration and login (handled by frontend Better Auth)
- Password reset or account management
- Task sharing between users
- Task categories, tags, or labels
- Task due dates or reminders
- Task priorities or ordering
- Batch operations on tasks
- Task search or filtering
- Pagination (can be added later if needed)
- Rate limiting (can be added later if needed)
- Audit logging
