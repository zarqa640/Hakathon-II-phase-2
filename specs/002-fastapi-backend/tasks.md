# Tasks: Todo App Backend API

**Input**: Design documents from `/specs/002-fastapi-backend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: Not explicitly requested - tests omitted per spec. Can be added later.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Convention

Web app backend: `backend/src/`, `backend/tests/`

---

## Phase 1: Setup (Project Infrastructure)

**Purpose**: Initialize backend project with Python/FastAPI structure and dependencies

- [x] T001 Create backend directory structure per plan.md: `backend/src/`, `backend/src/core/`, `backend/src/models/`, `backend/src/schemas/`, `backend/src/api/`, `backend/src/api/routes/`, `backend/tests/`
- [x] T002 Create `backend/requirements.txt` with FastAPI, SQLModel, python-jose, psycopg2-binary, uvicorn, python-dotenv, pydantic-settings
- [x] T003 [P] Create `backend/.env.example` with DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS placeholders
- [x] T004 [P] Create all `__init__.py` files in `backend/src/`, `backend/src/core/`, `backend/src/models/`, `backend/src/schemas/`, `backend/src/api/`, `backend/src/api/routes/`

**Checkpoint**: Project structure ready for core implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Configuration & Database

- [x] T005 Implement `backend/src/core/config.py` with Settings class loading DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS from environment
- [x] T006 Implement `backend/src/core/database.py` with SQLModel engine, create_db_and_tables(), and get_session() dependency

### Authentication Infrastructure

- [x] T007 Implement `backend/src/core/security.py` with decode_jwt() function using python-jose HS256 algorithm and BETTER_AUTH_SECRET
- [x] T008 Implement `backend/src/api/deps.py` with get_current_user() dependency that extracts Bearer token, verifies JWT, returns user_id

### Data Models & Schemas

- [x] T009 [P] Implement `backend/src/models/task.py` with SQLModel Task class (id, user_id, title, description, completed, created_at)
- [x] T010 [P] Implement `backend/src/schemas/task.py` with TaskCreate, TaskUpdate, TaskResponse Pydantic models

### Application Entry Point

- [x] T011 Implement `backend/src/main.py` with FastAPI app, CORS middleware (allow localhost:3000), and health check endpoint at `/api/health`

**Checkpoint**: Foundation ready - all user stories can now be implemented

---

## Phase 3: User Story 1 & 2 - View & Create Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to view their task list and create new tasks - core read/write functionality

**Independent Test**: Login via frontend, create a task with title/description, verify it appears in task list with correct user_id

**Stories Covered**:
- US1: View My Tasks (GET /api/tasks)
- US2: Create a New Task (POST /api/tasks)
- US5: Secure Cross-Origin Access (CORS - already in T011)

### Implementation

- [x] T012 [US1] Implement GET `/api/tasks` endpoint in `backend/src/api/routes/tasks.py` - return all tasks filtered by user_id from token
- [x] T013 [US2] Implement POST `/api/tasks` endpoint in `backend/src/api/routes/tasks.py` - create task with auto-assigned user_id, return 201
- [x] T014 Create router in `backend/src/api/routes/__init__.py` and mount tasks router in `backend/src/main.py` under `/api` prefix
- [x] T015 Add input validation for TaskCreate (title required, max lengths) with proper 422 responses

**Checkpoint**: Users can now view and create tasks - MVP complete

---

## Phase 4: User Story 3 - Update Tasks (Priority: P2)

**Goal**: Enable users to update task details and mark tasks as complete

**Independent Test**: Create a task, update its title/description, mark as completed, verify changes persist

### Implementation

- [x] T016 [US3] Implement PUT `/api/tasks/{id}` endpoint in `backend/src/api/routes/tasks.py` - update task with ownership verification
- [x] T017 [US3] Add ownership check: query by id AND user_id, return 404 if not found (prevents info leakage)
- [x] T018 [US3] Add input validation for TaskUpdate (optional fields, max lengths) with proper 422 responses

**Checkpoint**: Users can now update their tasks

---

## Phase 5: User Story 4 - Delete Tasks (Priority: P2)

**Goal**: Enable users to permanently remove tasks they no longer need

**Independent Test**: Create a task, delete it, verify it no longer appears in task list

### Implementation

- [x] T019 [US4] Implement DELETE `/api/tasks/{id}` endpoint in `backend/src/api/routes/tasks.py` - delete with ownership verification, return 204
- [x] T020 [US4] Add ownership check: query by id AND user_id, return 404 if not found

**Checkpoint**: Full CRUD operations complete

---

## Phase 6: Polish & Integration

**Purpose**: Error handling, edge cases, and frontend integration testing

- [x] T021 Add comprehensive error handling for database connection failures (503 Service Unavailable)
- [x] T022 Add error handling for JWT edge cases: expired tokens, malformed tokens, missing claims
- [x] T023 [P] Create `backend/README.md` with setup instructions and API documentation
- [ ] T024 Verify CORS preflight requests work correctly with frontend at localhost:3000
- [ ] T025 End-to-end testing: verify all endpoints work with actual frontend authentication flow

**Checkpoint**: Backend fully integrated and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)           → No dependencies - start immediately
    ↓
Phase 2 (Foundational)    → Depends on Phase 1 - BLOCKS all user stories
    ↓
Phase 3 (US1+US2: View/Create) → Depends on Phase 2 - MVP delivery
    ↓
Phase 4 (US3: Update)     → Can start after Phase 2 (parallel with 3 if staffed)
    ↓
Phase 5 (US4: Delete)     → Can start after Phase 2 (parallel with 3,4 if staffed)
    ↓
Phase 6 (Polish)          → Depends on all CRUD phases complete
```

### Task Dependencies Within Phases

**Phase 2 Critical Path**:
```
T005 (config) → T006 (database) → T011 (main.py)
T005 (config) → T007 (security) → T008 (deps)
T009, T010 can run in parallel after T005
```

**Phase 3 Critical Path**:
```
T012 (GET) + T013 (POST) → T014 (mount router) → T015 (validation)
```

### Parallel Opportunities

Within Phase 1:
- T003 (.env.example) and T004 (__init__.py files) can run in parallel

Within Phase 2:
- T009 (Task model) and T010 (schemas) can run in parallel after T005

Across Phases (if team capacity allows):
- Phase 4 (Update) and Phase 5 (Delete) can run in parallel after Phase 2

---

## Parallel Example: Phase 2 Foundational

```bash
# Sequential dependencies
T005 → T006 → T011  # Config → Database → Main app

# Parallel after T005
T005 completes, then:
  ├─ T007 → T008  # Security chain
  ├─ T009         # Task model (parallel)
  └─ T010         # Schemas (parallel)
```

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2 + Phase 3 (T001-T015)
2. Deploy and test with frontend
3. Then add Phase 4 + Phase 5 (T016-T020)
4. Final polish with Phase 6 (T021-T025)

### Incremental Delivery

| Milestone | Tasks | Deliverable |
|-----------|-------|-------------|
| Foundation | T001-T011 | Backend boots, health check works |
| MVP | T012-T015 | View and create tasks functional |
| Full CRUD | T016-T020 | Update and delete tasks functional |
| Production | T021-T025 | Error handling, documentation complete |

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | T001-T004 | Project structure and dependencies |
| Phase 2: Foundation | T005-T011 | Config, DB, auth, models, main app |
| Phase 3: View/Create (P1) | T012-T015 | GET and POST endpoints - MVP |
| Phase 4: Update (P2) | T016-T018 | PUT endpoint |
| Phase 5: Delete (P2) | T019-T020 | DELETE endpoint |
| Phase 6: Polish | T021-T025 | Error handling, docs, integration |

**Total Tasks**: 25
**MVP Tasks**: 15 (T001-T015)
**Parallel Opportunities**: 8 tasks marked [P]
