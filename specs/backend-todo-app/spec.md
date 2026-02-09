# Backend (Phase II) Specification - Todo App API

## Overview
This specification defines the FastAPI backend for the Todo App that connects with the existing Next.js + Better Auth frontend. The backend provides RESTful API endpoints for managing user tasks with proper authentication and authorization.

## 1. Tech Stack & Infrastructure

### 1.1 Technology Requirements
- **Framework:** FastAPI (Python 3.9+)
- **Database:** Neon Serverless PostgreSQL
- **ORM:** SQLModel (for typed database models)
- **Environment Management:** dotenv for configuration

### 1.2 Database Configuration
- **Database URL:** `postgresql://neondb_owner:npg_zlp0A7RxTPig@ep-sparkling-snow-ai1dn51s-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Connection:** Backend must connect to the same database used by the frontend
- **Pool Settings:** Configure connection pooling for efficient resource usage
- **SSL:** Must enforce SSL connections for security

### 1.3 Environment Variables
The backend must support the following environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - JWT signing secret (shared with frontend)
- `FRONTEND_URL` - CORS origin for frontend (default: http://localhost:3000)

## 2. Authentication & Security

### 2.1 JWT Token Verification
- The backend MUST NOT implement login/signup logic
- All API endpoints require JWT token verification
- Use the shared secret to decode/verify tokens: `mbBHQzMbW0mcD5yIParEqVk1ASXIxrM8`
- Extract `Bearer <token>` from Authorization header
- Verify token integrity and expiration
- Extract and return `user_id` from the verified token

### 2.2 Authentication Middleware
- Create a FastAPI dependency function for authentication
- Dependency must extract and verify JWT token from request headers
- Return authenticated user's ID for use in endpoints
- Return 401 Unauthorized for invalid/missing tokens
- Handle token expiration gracefully

### 2.3 CORS Configuration
- Configure CORS middleware to allow requests from `http://localhost:3000`
- Allow credentials to be passed with requests
- Support standard HTTP methods (GET, POST, PUT, DELETE)
- Allow Authorization header for JWT token transmission

## 3. Data Models

### 3.1 Task Model
The backend must implement a `Task` model with the following fields:

```python
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str  # Links to Better Auth User ID
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### 3.2 Request/Response Models
Create Pydantic models for API input/output validation:
- `TaskCreate` - For creating new tasks (excluding id, user_id, created_at)
- `TaskUpdate` - For updating existing tasks (all fields optional)
- `TaskRead` - For returning task data (including id and timestamps)

### 3.3 Database Constraints
- Primary key constraint on `id`
- Proper indexing on `user_id` for efficient queries
- Foreign key relationship conceptually linked to Better Auth user
- Enforce NOT NULL constraints where appropriate

## 4. API Endpoints

### 4.1 Authentication Requirements
All endpoints must be protected by the JWT authentication middleware and verify user ownership of resources.

### 4.2 Endpoint Specifications

#### 4.2.1 GET /api/tasks
- **Purpose:** Retrieve all tasks belonging to the authenticated user
- **Authentication:** Required
- **Parameters:** None
- **Response:** Array of Task objects belonging to the user
- **Success Code:** 200 OK
- **Headers:** Authorization: Bearer `<token>`
- **Security:** Only return tasks where `user_id` matches the authenticated user's ID

#### 4.2.2 POST /api/tasks
- **Purpose:** Create a new task for the authenticated user
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "title": "Task title",
    "description": "Optional description",
    "completed": false
  }
  ```
- **Response:** Created Task object with assigned ID and timestamps
- **Success Code:** 201 Created
- **Headers:** Authorization: Bearer `<token>`
- **Behavior:** Automatically assign `user_id` from the authenticated user's ID

#### 4.2.3 PUT /api/tasks/{id}
- **Purpose:** Update an existing task for the authenticated user
- **Authentication:** Required
- **Path Parameter:** `id` - Task ID to update
- **Request Body:** Partial update allowed
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "completed": true
  }
  ```
- **Response:** Updated Task object
- **Success Code:** 200 OK
- **Error Codes:** 404 Not Found if task doesn't exist, 403 Forbidden if user doesn't own the task
- **Headers:** Authorization: Bearer `<token>`
- **Security:** Verify that the authenticated user owns the task before updating

#### 4.2.4 DELETE /api/tasks/{id}
- **Purpose:** Delete an existing task for the authenticated user
- **Authentication:** Required
- **Path Parameter:** `id` - Task ID to delete
- **Response:** Empty body
- **Success Code:** 204 No Content
- **Error Codes:** 404 Not Found if task doesn't exist, 403 Forbidden if user doesn't own the task
- **Headers:** Authorization: Bearer `<token>`
- **Security:** Verify that the authenticated user owns the task before deleting

## 5. Security & Access Control

### 5.1 Row-Level Security Implementation
- Implement application-level row-level security to ensure users can only access their own data
- Before any database operation, verify that the authenticated user's ID matches the `user_id` in the record
- Return 403 Forbidden for unauthorized access attempts
- Apply this check consistently across all endpoints

### 5.2 Input Validation
- Validate all incoming request data using Pydantic models
- Sanitize and validate user inputs to prevent injection attacks
- Set reasonable limits on input sizes (e.g., max length for titles/descriptions)

### 5.3 Rate Limiting (Optional Enhancement)
- Consider implementing rate limiting to prevent abuse
- Standard rate limits: 100 requests per hour per user

## 6. Error Handling

### 6.1 Error Response Format
All error responses should follow this format:
```json
{
  "detail": "Human-readable error message"
}
```

### 6.2 HTTP Status Codes
- 200 OK: Successful GET, PUT requests
- 201 Created: Successful POST request
- 204 No Content: Successful DELETE request
- 400 Bad Request: Invalid request data
- 401 Unauthorized: Missing or invalid authentication
- 403 Forbidden: User doesn't have permission for the resource
- 404 Not Found: Requested resource doesn't exist
- 422 Unprocessable Entity: Validation error
- 500 Internal Server Error: Unexpected server error

## 7. Testing Requirements

### 7.1 Unit Tests
- Test all authentication middleware functions
- Test all Pydantic model validations
- Test database model operations independently

### 7.2 Integration Tests
- Test all API endpoints with mocked authentication
- Test security controls (ensure users can't access others' data)
- Test error conditions and responses

### 7.3 End-to-End Tests
- Test complete workflows with real authentication
- Verify the integration between frontend and backend

## 8. Deployment & Operations

### 8.1 Application Setup
- Initialize database connection on startup
- Configure logging for production
- Set up health check endpoint at `/health`

### 8.2 Configuration
- Support environment-based configuration
- Secure handling of sensitive data (secrets, database credentials)
- Proper shutdown procedures for database connections

## 9. Acceptance Criteria

### 9.1 Functional Requirements
- [ ] All four API endpoints implemented and functional
- [ ] JWT authentication working correctly
- [ ] User isolation enforced (users can only access their own tasks)
- [ ] CORS configured for localhost:3000
- [ ] Database operations working with Neon PostgreSQL

### 9.2 Non-Functional Requirements
- [ ] All endpoints return proper HTTP status codes
- [ ] Input validation prevents malformed requests
- [ ] Error responses follow consistent format
- [ ] Security measures prevent unauthorized access
- [ ] Performance acceptable for typical usage patterns

### 9.3 Quality Requirements
- [ ] Code follows Python best practices and FastAPI conventions
- [ ] Comprehensive test coverage (>80%)
- [ ] Proper documentation of API endpoints
- [ ] Clean, maintainable code structure