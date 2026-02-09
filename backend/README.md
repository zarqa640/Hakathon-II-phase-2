# Todo App Backend API

FastAPI backend for Todo App Phase II - Task CRUD operations with JWT authentication.

## Features

- JWT token verification (Better Auth compatible)
- CRUD operations for tasks (Create, Read, Update, Delete)
- User isolation - users can only access their own tasks
- CORS support for frontend integration

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT (python-jose)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=your_secret_here
CORS_ORIGINS=http://localhost:3000
```

### 3. Run the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Verify Installation

- Health check: http://localhost:8000/api/health
- API docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (no auth) |
| GET | `/api/tasks` | List user's tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

All `/api/tasks` endpoints require `Authorization: Bearer <token>` header.

## Authentication

The backend verifies JWT tokens issued by Better Auth using HS256 algorithm.
The `BETTER_AUTH_SECRET` must match the frontend's secret.

Token payload expected:
```json
{
  "sub": "user_id",
  "exp": 1234567890
}
```

## Project Structure

```
backend/
├── src/
│   ├── main.py           # FastAPI app entry point
│   ├── core/
│   │   ├── config.py     # Environment configuration
│   │   ├── database.py   # SQLModel engine & sessions
│   │   └── security.py   # JWT verification
│   ├── models/
│   │   └── task.py       # SQLModel Task entity
│   ├── schemas/
│   │   └── task.py       # Pydantic request/response schemas
│   └── api/
│       ├── deps.py       # FastAPI dependencies
│       └── routes/
│           └── tasks.py  # CRUD endpoints
├── tests/
├── requirements.txt
└── .env.example
```

## Error Responses

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful delete) |
| 401 | Unauthorized - invalid/missing token |
| 404 | Not Found - task doesn't exist or not owned |
| 422 | Validation Error - invalid input |
| 503 | Service Unavailable - database error |
