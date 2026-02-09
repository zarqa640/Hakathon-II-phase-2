---
id: "0002"
title: Create FastAPI Backend Implementation Plan
stage: plan
date: 2026-02-08
surface: agent
model: gemini-2.5-flash
feature: 002-fastapi-backend
branch: 002-fastapi-backend
user: zarqa
command: /sp.plan
labels: ["backend", "fastapi", "architecture", "planning", "jwt"]
links:
  spec: specs/002-fastapi-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-fastapi-backend/plan.md
  - specs/002-fastapi-backend/research.md
  - specs/002-fastapi-backend/data-model.md
  - specs/002-fastapi-backend/quickstart.md
  - specs/002-fastapi-backend/contracts/openapi.yaml
tests:
  - null
---

## Prompt

Now that the requirements are defined in `speckit.specify`, please generate the **`speckit.plan`** (Architecture & Design) for the Backend.

The plan should detail the technical implementation of the FastAPI service for Phase II.

Please include the following sections in the plan:

## 1. System Architecture
- **Monolith Modular Structure:** Use a clean folder structure within the `backend/` directory.
- **Data Flow:**
  1. Client (Next.js) sends HTTP Request + `Authorization: Bearer <token>`.
  2. **Middleware (`auth.py`):** Intercepts request -> Decodes JWT using `BETTER_AUTH_SECRET` -> Extracts `user_id` -> Injects user into `request.state`.
  3. **Router (`tasks.py`):** Receives request -> Calls Service/CRUD.
  4. **Database (`db.py`):** SQLModel Session executes query on Neon DB.

## 2. Component Breakdown & File Structure
Define the purpose of these specific files:
- `src/main.py`: App entry point, CORS configuration (allow `localhost:3000`).
- `src/core/config.py`: Loads environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`).
- `src/core/security.py`: Logic to decode and verify JWT tokens (HS256 algorithm).
- `src/models/task.py`: The SQLModel class for the `tasks` table.
- `src/api/deps.py`: Dependency injection for Database Session and Current User.
- `src/api/routes/tasks.py`: Implementation of GET, POST, PUT, DELETE endpoints.

## 3. Database Schema Design (SQLModel)
- Define the `Task` model with fields:
  - `id`: Optional[int] (Primary Key)
  - `title`: str
  - `description`: Optional[str]
  - `completed`: bool (default=False)
  - `user_id`: str (Indexed for performance)
  - `created_at`: datetime (default=now)
- **Note:** The `users` table is managed by Better Auth, so we only reference `user_id` loosely.

## 4. Security Implementation Details
- Algorithm: `HS256`
- Secret: `mbBHQzMbW0mcD5yIParEqVk1ASXIxrM8` (Reference from env)
- Validation: Ensure the token is not expired and the signature is valid.

## 5. Development Steps (Plan for `speckit.tasks`)
Briefly outline the order of implementation:
1.  Setup Project & Env.
2.  Configure Database & Models.
3.  Implement Auth/Security Dependency.
4.  Create CRUD Routes.
5.  Test with Frontend.

Please generate the full `speckit.plan` content based on this architecture.

## Response snapshot

Created comprehensive implementation plan for FastAPI backend with:

**Phase 0 - Research (research.md)**:
- JWT token structure from Better Auth (sub claim for user_id)
- HS256 algorithm confirmation
- SQLModel vs SQLAlchemy decision
- Neon PostgreSQL connection strategy
- Error response format analysis

**Phase 1 - Design Artifacts**:
- **plan.md**: Full architecture plan with:
  - Constitution check (ALL PASS)
  - Data flow diagram
  - Component responsibilities table
  - Security implementation details
  - API endpoints table
  - Development phases (5 phases, 18 steps)
  - Risk mitigation strategies
  - Dependencies list

- **data-model.md**: SQLModel Task entity with:
  - Field definitions and constraints
  - Validation rules
  - Indexes (user_id)
  - State transitions diagram
  - SQL migration script
  - Query patterns

- **contracts/openapi.yaml**: Full OpenAPI 3.1 spec with:
  - 4 task endpoints + health check
  - Request/response schemas
  - Error responses (401, 404, 422)
  - JWT security scheme

- **quickstart.md**: Setup guide with:
  - Prerequisites and installation
  - Environment configuration
  - Testing commands
  - Common issues troubleshooting

## Outcome

- ✅ Impact: Complete architectural blueprint ready for implementation
- 🧪 Tests: N/A (planning phase - no code yet)
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, contracts/openapi.yaml
- 🔁 Next prompts: /sp.tasks to generate implementation tasks
- 🧠 Reflection: User provided detailed architecture requirements which were incorporated into a comprehensive plan that passes all constitution checks

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All constitution gates validated
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
