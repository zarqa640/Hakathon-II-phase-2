# Implementation Plan: Todo App Backend API

**Branch**: `002-fastapi-backend` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fastapi-backend/spec.md`

## Summary

Build a FastAPI backend service that provides RESTful CRUD endpoints for task management. The backend verifies JWT tokens issued by the frontend's Better Auth system using a shared secret (HS256), connects to the same Neon PostgreSQL database, and enforces strict user isolation at the application level.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, python-jose (JWT), asyncpg/psycopg2
**Storage**: Neon Serverless PostgreSQL (shared with frontend)
**Testing**: pytest, pytest-asyncio, httpx (for API testing)
**Target Platform**: Linux server (localhost:8000 for development)
**Project Type**: Web application backend (monolith modular)
**Performance Goals**: <500ms response time for all CRUD operations under normal load
**Constraints**: Must verify JWT tokens from Better Auth, no login/signup logic
**Scale/Scope**: Single-user development, supports concurrent task operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| 1.1 Separation of Concerns | ✅ PASS | Backend handles server-side only, communicates via REST API |
| 1.2 Monorepo Structure | ✅ PASS | Backend code in `backend/` directory within repository |
| 1.3 Spec-First Development | ✅ PASS | spec.md created before implementation plan |
| 2.1 Mandatory Authentication | ✅ PASS | JWT verification on all `/api/tasks` endpoints |
| 2.2 User Data Isolation | ✅ PASS | All queries filter by user_id from token |
| 2.3 Shared Secrets | ✅ PASS | BETTER_AUTH_SECRET via environment variable |
| 3.1 RESTful Design | ✅ PASS | GET/POST/PUT/DELETE with resource-based URLs |
| 3.2 API Endpoint Structure | ✅ PASS | All routes under `/api` prefix |
| 3.3 Data Format Requirements | ✅ PASS | JSON request/response, proper HTTP status codes |
| 4.1 Data Storage | ✅ PASS | Neon PostgreSQL only |
| 4.2 User-Data Association | ✅ PASS | Tasks table has user_id foreign key |
| 4.3 Data Access Controls | ✅ PASS | All DB access through backend API |
| 6.1 Phase 2 Boundaries | ✅ PASS | Only task CRUD and auth verification |

**Gate Result**: ALL PASS - Proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-fastapi-backend/
├── plan.md              # This file
├── research.md          # Phase 0 output - JWT/Better Auth research
├── data-model.md        # Phase 1 output - SQLModel schema
├── quickstart.md        # Phase 1 output - Setup instructions
├── contracts/           # Phase 1 output - OpenAPI spec
│   └── openapi.yaml
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point, CORS config
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Environment variables (DATABASE_URL, BETTER_AUTH_SECRET)
│   │   ├── database.py      # SQLModel engine & session management
│   │   └── security.py      # JWT decode/verify logic (HS256)
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # SQLModel Task class
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py          # Pydantic request/response schemas
│   └── api/
│       ├── __init__.py
│       ├── deps.py          # Dependency injection (get_db, get_current_user)
│       └── routes/
│           ├── __init__.py
│           └── tasks.py     # CRUD endpoints for tasks
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # pytest fixtures
│   ├── test_auth.py         # JWT verification tests
│   └── test_tasks.py        # CRUD endpoint tests
├── requirements.txt
├── .env.example
└── README.md
```

**Structure Decision**: Web application backend structure selected. Backend-only since frontend already exists. Clean separation with `core/` for shared utilities, `models/` for SQLModel classes, `schemas/` for Pydantic DTOs, and `api/` for route handlers.

## System Architecture

### Data Flow

```
┌─────────────────────┐
│  Next.js Frontend   │
│  (localhost:3000)   │
└─────────┬───────────┘
          │ HTTP + Authorization: Bearer <token>
          ▼
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Backend                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │  CORS Middleware (allow localhost:3000)         │    │
│  └─────────────────────┬───────────────────────────┘    │
│                        ▼                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Auth Dependency (deps.py)                      │    │
│  │  - Extract Bearer token                         │    │
│  │  - Decode JWT with BETTER_AUTH_SECRET (HS256)   │    │
│  │  - Validate expiration                          │    │
│  │  - Extract user_id → return to route            │    │
│  └─────────────────────┬───────────────────────────┘    │
│                        ▼                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Route Handler (routes/tasks.py)                │    │
│  │  - Receive user_id from dependency              │    │
│  │  - Execute CRUD with user_id filter             │    │
│  │  - Return JSON response                         │    │
│  └─────────────────────┬───────────────────────────┘    │
│                        ▼                                 │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Database Session (core/database.py)            │    │
│  │  - SQLModel async session                       │    │
│  │  - Connection to Neon PostgreSQL                │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Neon PostgreSQL    │
│  (shared database)  │
└─────────────────────┘
```

### Component Responsibilities

| Component | File | Responsibility |
|-----------|------|----------------|
| App Entry | `src/main.py` | FastAPI app init, CORS config, router mounting |
| Config | `src/core/config.py` | Load DATABASE_URL, BETTER_AUTH_SECRET from env |
| Security | `src/core/security.py` | JWT decode/verify using python-jose |
| Database | `src/core/database.py` | SQLModel engine, session factory |
| Task Model | `src/models/task.py` | SQLModel table definition |
| Task Schemas | `src/schemas/task.py` | Request/response Pydantic models |
| Dependencies | `src/api/deps.py` | get_db session, get_current_user from token |
| Task Routes | `src/api/routes/tasks.py` | GET/POST/PUT/DELETE /api/tasks |

## Security Implementation

### JWT Verification Flow

```python
# Expected token structure from Better Auth
{
  "sub": "user_id_string",  # User identifier
  "exp": 1234567890,        # Expiration timestamp
  "iat": 1234567800,        # Issued at timestamp
  ...                       # Other Better Auth claims
}
```

### Verification Steps

1. Extract `Authorization` header
2. Validate `Bearer <token>` format
3. Decode JWT using `BETTER_AUTH_SECRET` with HS256 algorithm
4. Check token expiration (`exp` claim)
5. Extract `sub` claim as `user_id`
6. Return user_id to route handler

### Error Responses

| Scenario | HTTP Status | Response |
|----------|-------------|----------|
| Missing Authorization header | 401 | `{"detail": "Not authenticated"}` |
| Invalid Bearer format | 401 | `{"detail": "Invalid authentication credentials"}` |
| Invalid/tampered token | 401 | `{"detail": "Could not validate credentials"}` |
| Expired token | 401 | `{"detail": "Token has expired"}` |

## Database Schema

### Task Table (SQLModel)

```python
class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # From JWT sub claim
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Indexes

- `id`: Primary key (auto-indexed)
- `user_id`: Index for fast user-specific queries

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/tasks` | List user's tasks | - | `Task[]` |
| POST | `/api/tasks` | Create task | `{title, description?}` | `Task` (201) |
| PUT | `/api/tasks/{id}` | Update task | `{title?, description?, completed?}` | `Task` |
| DELETE | `/api/tasks/{id}` | Delete task | - | 204 No Content |

### Request/Response Schemas

```python
# Create Task Request
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)

# Update Task Request
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    completed: Optional[bool] = None

# Task Response
class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
```

## CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
```

## Environment Variables

```bash
# .env.example
DATABASE_URL=postgresql://neondb_owner:npg_zlp0A7RxTPig@ep-sparkling-snow-ai1dn51s-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=mbBHQzMbW0mcD5yIParEqVk1ASXIxrM8
CORS_ORIGINS=http://localhost:3000
```

## Development Steps (for /sp.tasks)

### Phase 1: Project Setup
1. Initialize backend directory structure
2. Create requirements.txt with dependencies
3. Create .env.example file
4. Setup config.py to load environment variables

### Phase 2: Database & Models
5. Implement database.py with SQLModel engine
6. Create Task model in models/task.py
7. Create task schemas in schemas/task.py

### Phase 3: Authentication
8. Implement JWT verification in security.py
9. Create auth dependency in deps.py
10. Write auth unit tests

### Phase 4: CRUD Routes
11. Implement GET /api/tasks
12. Implement POST /api/tasks
13. Implement PUT /api/tasks/{id}
14. Implement DELETE /api/tasks/{id}
15. Write CRUD integration tests

### Phase 5: Integration
16. Configure CORS in main.py
17. Mount all routers
18. End-to-end testing with frontend

## Complexity Tracking

> No constitution violations requiring justification.

| Aspect | Complexity Level | Justification |
|--------|------------------|---------------|
| Architecture | Simple | Single service, direct DB access |
| Auth | Standard | JWT verify only, no issuing |
| Data Model | Minimal | Single entity (Task) |
| API Surface | Small | 4 CRUD endpoints |

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| JWT secret mismatch | Verify with frontend team, document in .env.example |
| Token claim structure | Research Better Auth token format in Phase 0 |
| Database connection pooling | Use SQLModel with proper session management |
| CORS issues | Test preflight requests early in development |

## Dependencies

```text
# requirements.txt
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
python-jose[cryptography]>=3.3.0
psycopg2-binary>=2.9.9
python-dotenv>=1.0.0
pydantic>=2.5.0
pydantic-settings>=2.1.0

# Testing
pytest>=7.4.0
pytest-asyncio>=0.23.0
httpx>=0.26.0
```
