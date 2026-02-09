---
id: "0001"
title: Create FastAPI Backend Specification
stage: spec
date: 2026-02-08
surface: agent
model: gemini-2.5-flash
feature: 002-fastapi-backend
branch: 002-fastapi-backend
user: zarqa
command: /sp.specify
labels: ["backend", "fastapi", "jwt", "todo-app", "specification"]
links:
  spec: specs/002-fastapi-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-fastapi-backend/spec.md
  - specs/002-fastapi-backend/checklists/requirements.md
tests:
  - null
---

## Prompt

I need to create the detailed specification for the Backend (Phase II) of my Todo App. The Frontend is already built using Next.js and Better Auth. Now I need the FastAPI backend to connect with it.

Please generate the `speckit.specify` (or requirements spec) for the Backend with the following strict requirements:

## 1. Tech Stack & Database
- **Framework:** FastAPI (Python)
- **Database:** Neon Serverless PostgreSQL (Use SQLModel for ORM)
- **Database URL:** `postgresql://neondb_owner:npg_zlp0A7RxTPig@ep-sparkling-snow-ai1dn51s-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Connection:** The backend must connect to the SAME database used by the frontend.

## 2. Authentication & Security (Crucial)
- The Frontend handles Login/Signup using "Better Auth".
- The Backend MUST NOT reimplement login logic. Instead, it must **Verify JWT Tokens** sent by the frontend.
- **Shared Secret:** The backend must use the following secret to decode/verify tokens (matches frontend's BETTER_AUTH_SECRET):
  `BETTER_AUTH_SECRET=mbBHQzMbW0mcD5yIParEqVk1ASXIxrM8`
- **Middleware:** Create a dependency that extracts the `Bearer <token>` from the header, verifies it using the secret, and returns the `user_id`.
- **CORS:** Allow requests specifically from `http://localhost:3000` (Frontend URL).

## 3. Data Model (Schema)
- **Table: Tasks**
  - `id`: Integer (Primary Key)
  - `user_id`: String (Foreign Key - links to Better Auth User)
  - `title`: String
  - `description`: String (Optional)
  - `completed`: Boolean (Default: False)
  - `created_at`: Timestamp
- **Constraint:** Ensure strict RLS-like logic at the application level (A user can only access their OWN tasks based on `user_id` from the token).

## 4. API Endpoints
Implement the following RESTful endpoints (all protected by Auth Middleware):
1.  `GET /api/tasks` - List all tasks for the logged-in user.
2.  `POST /api/tasks` - Create a new task (automatically assign `user_id` from token).
3.  `PUT /api/tasks/{id}` - Update a task (verify ownership first).
4.  `DELETE /api/tasks/{id}` - Delete a task (verify ownership first).

Please write the full specification file based on these requirements so I can proceed to the planning phase.

## Response snapshot

Created comprehensive specification for Todo App Backend API (Feature 002-fastapi-backend):

**Key Deliverables:**
- 5 prioritized user stories with acceptance scenarios (View Tasks, Create Task, Update Task, Delete Task, CORS Access)
- 14 functional requirements covering JWT verification, user isolation, CRUD operations, and CORS
- 6 measurable success criteria
- Edge cases for error handling (expired tokens, malformed tokens, DB failures)
- Clear assumptions, constraints, dependencies, and out-of-scope items
- Requirements quality checklist (all items passing)

**Branch:** `002-fastapi-backend`
**Spec File:** `specs/002-fastapi-backend/spec.md`

## Outcome

- ✅ Impact: Created complete business-focused specification for backend API feature
- 🧪 Tests: N/A (specification phase - no code tests)
- 📁 Files: Created spec.md and requirements.md checklist
- 🔁 Next prompts: /sp.clarify (optional) or /sp.plan to proceed to planning phase
- 🧠 Reflection: User provided detailed technical requirements which were successfully translated into technology-agnostic specification while preserving all business intent

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All checklist items validated
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
