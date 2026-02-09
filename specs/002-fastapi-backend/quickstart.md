# Quickstart: Todo App Backend API

**Feature**: 002-fastapi-backend
**Date**: 2026-02-08

## Prerequisites

- Python 3.11+
- pip or pipenv
- Access to Neon PostgreSQL database
- Frontend running at `http://localhost:3000` (for integration testing)

## Quick Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_zlp0A7RxTPig@ep-sparkling-snow-ai1dn51s-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=mbBHQzMbW0mcD5yIParEqVk1ASXIxrM8
CORS_ORIGINS=http://localhost:3000
```

### 5. Run the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Verify Installation

Open http://localhost:8000/api/health in your browser. You should see:

```json
{"status": "healthy", "timestamp": "2026-02-08T..."}
```

## API Documentation

Once running, access interactive API docs at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Run All Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=src --cov-report=html
```

### Test Specific Module

```bash
pytest tests/test_tasks.py -v
```

## Integration Testing with Frontend

1. Start the backend: `uvicorn src.main:app --reload`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Login via frontend at http://localhost:3000
4. Create/view tasks through the UI

## Common Issues

### CORS Errors

If you see CORS errors in the browser console:
- Verify `CORS_ORIGINS` matches your frontend URL exactly
- Check that the backend is running on port 8000

### Database Connection Failed

If you see database connection errors:
- Verify `DATABASE_URL` is correct
- Ensure Neon database is active (not paused)
- Check SSL mode is enabled (`sslmode=require`)

### JWT Validation Failed

If authentication fails with 401:
- Verify `BETTER_AUTH_SECRET` matches frontend's secret
- Check token is being sent in `Authorization: Bearer <token>` format
- Ensure token is not expired

## Development Workflow

1. Make code changes
2. Run tests: `pytest`
3. Test manually with frontend
4. Create PR when ready

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | JWT signing secret (must match frontend) | Yes |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) | Yes |

## Project Structure

```
backend/
├── src/
│   ├── main.py           # App entry, CORS
│   ├── core/
│   │   ├── config.py     # Environment config
│   │   ├── database.py   # DB connection
│   │   └── security.py   # JWT verification
│   ├── models/
│   │   └── task.py       # SQLModel Task
│   ├── schemas/
│   │   └── task.py       # Pydantic schemas
│   └── api/
│       ├── deps.py       # Dependencies
│       └── routes/
│           └── tasks.py  # CRUD endpoints
├── tests/
│   ├── conftest.py       # Test fixtures
│   ├── test_auth.py      # Auth tests
│   └── test_tasks.py     # CRUD tests
├── requirements.txt
├── .env.example
└── README.md
```

## Next Steps

After setup:
1. Run `/sp.tasks` to generate implementation tasks
2. Implement tasks in order (setup → models → auth → routes)
3. Test with frontend integration
