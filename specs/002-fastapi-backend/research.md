# Research: Todo App Backend API

**Feature**: 002-fastapi-backend
**Date**: 2026-02-08
**Status**: Complete

## Research Questions

### 1. Better Auth JWT Token Structure

**Question**: What is the exact structure of JWT tokens issued by Better Auth?

**Research Findings**:

Better Auth issues JWT tokens with the following standard structure:

```json
{
  "sub": "user_id",           // User's unique identifier (string)
  "exp": 1234567890,          // Expiration timestamp (Unix)
  "iat": 1234567800,          // Issued at timestamp (Unix)
  "email": "user@example.com" // Optional: user email
}
```

**Decision**: Use `sub` claim to extract user_id. The claim contains the user's ID from Better Auth's user table.

**Rationale**: Standard JWT convention uses `sub` (subject) for the principal identifier. Better Auth follows this convention.

**Alternatives Considered**:
- Using `userId` custom claim - Rejected: Not standard Better Auth behavior
- Using session-based auth - Rejected: Constitution requires JWT

### 2. JWT Signing Algorithm

**Question**: What algorithm does Better Auth use for signing JWTs?

**Research Findings**:

Based on the user's specification and Better Auth documentation:
- Default algorithm: HS256 (HMAC with SHA-256)
- Symmetric key signing using `BETTER_AUTH_SECRET`
- No asymmetric (RS256) configuration detected in frontend

**Decision**: Use HS256 algorithm with the shared secret `BETTER_AUTH_SECRET`

**Rationale**: User explicitly specified HS256, and this matches Better Auth's default symmetric signing.

**Alternatives Considered**:
- RS256 (asymmetric) - Rejected: Would require public key, not configured
- None algorithm - Rejected: Security risk, not acceptable

### 3. SQLModel vs SQLAlchemy for Neon PostgreSQL

**Question**: Which ORM is best for FastAPI with Neon Serverless PostgreSQL?

**Research Findings**:

| Feature | SQLModel | SQLAlchemy |
|---------|----------|------------|
| Pydantic integration | Native | Manual |
| FastAPI compatibility | Excellent | Good |
| Type hints | Built-in | Optional |
| Async support | Yes (via SQLAlchemy) | Yes |
| Neon compatibility | Yes | Yes |

**Decision**: Use SQLModel as specified by user

**Rationale**:
- Native Pydantic integration reduces boilerplate
- User explicitly requested SQLModel
- FastAPI documentation recommends SQLModel

**Alternatives Considered**:
- Pure SQLAlchemy - Rejected: More boilerplate, user specified SQLModel
- Tortoise ORM - Rejected: Less FastAPI community support

### 4. Database Connection Strategy for Neon Serverless

**Question**: How should we handle database connections with Neon's serverless PostgreSQL?

**Research Findings**:

Neon Serverless PostgreSQL considerations:
- Cold start delays possible (first connection)
- Connection pooling recommended
- SSL required (`sslmode=require`)
- Pooler endpoint provided in connection string

**Decision**:
- Use synchronous psycopg2 connections (simpler for Phase 2)
- Enable SSL mode as required by Neon
- Use SQLModel session management with connection pooling

**Rationale**: Synchronous approach simpler for MVP, Neon pooler handles connection management.

**Alternatives Considered**:
- Async with asyncpg - Considered for future: More complex setup
- Direct connections without pooler - Rejected: Neon recommends pooler

### 5. User ID Type Consistency

**Question**: What type should user_id be in the Task model?

**Research Findings**:

Frontend context (`frontend/src/context/auth.tsx`):
```typescript
interface User {
  id: number;  // Note: number in frontend
  email: string;
  ...
}
```

JWT `sub` claim from Better Auth: String type

**Decision**: Use `str` type for `user_id` in Task model

**Rationale**:
- JWT `sub` claim is always a string
- Database can store both numeric IDs as strings
- Provides flexibility for UUID migration later
- Avoids type conversion errors

**Alternatives Considered**:
- Integer type - Rejected: JWT sub is string, would need conversion
- UUID type - Rejected: Overkill for Phase 2, adds complexity

### 6. Error Response Format

**Question**: What error response format should the API use?

**Research Findings**:

FastAPI default HTTPException format:
```json
{"detail": "Error message"}
```

Frontend expectation (`frontend/src/lib/api.ts`):
```typescript
throw new Error(data.message || `API request failed: ${response.status}`);
```

**Decision**: Use FastAPI's default `{"detail": "..."}` format

**Rationale**:
- Standard FastAPI convention
- Frontend falls back gracefully to status code
- Consistent with HTTPException behavior

**Alternatives Considered**:
- Custom `{"message": "..."}` format - Rejected: Non-standard for FastAPI
- Verbose error objects - Rejected: Over-engineering for Phase 2

## Frontend Integration Notes

Based on analysis of `frontend/src/lib/api.ts` and `frontend/src/context/auth.tsx`:

1. **API Base URL**: `http://localhost:8000/api` (configured via `NEXT_PUBLIC_API_URL`)
2. **Token Header**: `Authorization: Bearer <token>`
3. **Token Storage**: localStorage as `authToken`
4. **Expected Response Fields**:
   - Task list: Array of task objects
   - Task create/update: Single task object
   - Delete: No content (204)

## Summary of Decisions

| Area | Decision | Risk Level |
|------|----------|------------|
| JWT Claim | Use `sub` for user_id | Low |
| Algorithm | HS256 symmetric | Low |
| ORM | SQLModel | Low |
| DB Connection | Sync with pooler | Low |
| user_id Type | String | Low |
| Error Format | `{"detail": "..."}` | Low |

All research questions resolved. Ready for Phase 1 design.
