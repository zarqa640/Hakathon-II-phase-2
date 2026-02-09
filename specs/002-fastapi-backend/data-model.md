# Data Model: Todo App Backend API

**Feature**: 002-fastapi-backend
**Date**: 2026-02-08
**Status**: Final

## Entity Overview

```
┌─────────────────────────────────────┐
│              Task                    │
├─────────────────────────────────────┤
│ PK  id: int (auto)                  │
│     user_id: str (indexed)          │
│     title: str (max 255)            │
│     description: str? (max 2000)    │
│     completed: bool (default false) │
│     created_at: datetime (auto)     │
└─────────────────────────────────────┘
          │
          │ References (logical, not FK)
          ▼
┌─────────────────────────────────────┐
│         User (Better Auth)          │
│       [Managed by Frontend]         │
├─────────────────────────────────────┤
│ PK  id: str                         │
│     email: str                      │
│     ... (other Better Auth fields)  │
└─────────────────────────────────────┘
```

## Task Entity

### Description

A Task represents a unit of work that a user wants to track. Each task belongs to exactly one user (identified by `user_id` from JWT token) and contains information about what needs to be done and its completion status.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique identifier for the task |
| `user_id` | String | Required, Indexed | Owner's ID from JWT `sub` claim |
| `title` | String | Required, Max 255 chars | Brief description of the task |
| `description` | String | Optional, Max 2000 chars | Detailed description |
| `completed` | Boolean | Default: false | Whether task is done |
| `created_at` | DateTime | Auto-set on create | UTC timestamp of creation |

### SQLModel Definition

```python
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Validation Rules

| Field | Rule | Error Response |
|-------|------|----------------|
| `title` | Required, non-empty | 422: "title is required" |
| `title` | Max 255 characters | 422: "title must be at most 255 characters" |
| `description` | Max 2000 characters | 422: "description must be at most 2000 characters" |
| `user_id` | Auto-set from JWT | N/A (server-side only) |
| `completed` | Boolean only | 422: "completed must be a boolean" |

### Indexes

| Index | Column(s) | Purpose |
|-------|-----------|---------|
| Primary Key | `id` | Unique task identification |
| `ix_tasks_user_id` | `user_id` | Fast lookup of user's tasks |

### Business Rules

1. **User Isolation**: Tasks are only accessible by their owner
   - All queries MUST filter by `user_id`
   - `user_id` comes from JWT token, never from request body

2. **Ownership Verification**: Before UPDATE or DELETE
   - Query task by `id` AND `user_id`
   - Return 404 if not found (prevents information leakage)

3. **Immutable Fields**: Once created, cannot be changed:
   - `id` (auto-generated)
   - `user_id` (from token at creation)
   - `created_at` (auto-set)

4. **Soft Delete**: Not implemented (per spec)
   - DELETE operation permanently removes the task

## User Entity (Reference Only)

**Note**: The User entity is managed by Better Auth in the frontend. The backend only references `user_id` from JWT tokens.

### Fields (for reference)

| Field | Type | Source |
|-------|------|--------|
| `id` | String | JWT `sub` claim |
| `email` | String | JWT claim (optional use) |

### Integration

- Backend does NOT query the users table directly
- User identity is established through JWT verification
- `user_id` in Task table links to Better Auth user

## State Transitions

### Task Lifecycle

```
                    ┌──────────────────┐
                    │                  │
    POST /tasks     │   Task Created   │
   ─────────────►   │   completed=F    │
                    │                  │
                    └────────┬─────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
             ▼               ▼               ▼
    ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
    │ PUT (complete) │ │ PUT (update) │ │    DELETE    │
    │ completed=T    │ │ title/desc   │ │              │
    └────────────────┘ └──────────────┘ └──────────────┘
             │               │               │
             ▼               │               ▼
    ┌────────────────┐       │      ┌──────────────────┐
    │ Task Completed │◄──────┘      │  Task Deleted    │
    │ completed=T    │              │  (permanent)     │
    └────────────────┘              └──────────────────┘
```

### Valid State Changes

| From | To | Trigger | Notes |
|------|-----|---------|-------|
| Created (incomplete) | Updated | PUT with title/description | Content update |
| Created (incomplete) | Completed | PUT with completed=true | Mark as done |
| Completed | Incomplete | PUT with completed=false | Reopen task |
| Any | Deleted | DELETE | Permanent removal |

## Database Migration

### Initial Migration (Create Table)

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000),
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX ix_tasks_user_id ON tasks (user_id);
```

### Notes on Schema

- No foreign key to users table (Better Auth manages users separately)
- `user_id` is VARCHAR to match JWT string format
- Index on `user_id` critical for query performance
- `created_at` uses database timestamp for consistency

## Query Patterns

### Common Queries

```python
# Get all tasks for a user
SELECT * FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC;

# Get specific task (with ownership check)
SELECT * FROM tasks WHERE id = :task_id AND user_id = :user_id;

# Create task
INSERT INTO tasks (user_id, title, description, completed, created_at)
VALUES (:user_id, :title, :description, false, NOW())
RETURNING *;

# Update task (with ownership check)
UPDATE tasks
SET title = :title, description = :description, completed = :completed
WHERE id = :task_id AND user_id = :user_id
RETURNING *;

# Delete task (with ownership check)
DELETE FROM tasks WHERE id = :task_id AND user_id = :user_id;
```

### Performance Considerations

- Always include `user_id` in WHERE clause
- Use index on `user_id` for efficient filtering
- Limit result sets if pagination added later
