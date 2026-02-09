---
id: constitution-phase2-todo-app
title: Phase 2 Full-Stack Todo Web Application Constitution
phase: 2
type: constitution
author: Spec-Kit
version: 1.0.0
created: 2026-02-05
---

# Phase 2 Full-Stack Todo Web Application Constitution

This constitution defines the core, non-negotiable rules that all agents, skills, and implementations must follow when developing the Phase 2 Full-Stack Todo Web Application.

## 1. Architectural Principles

### 1.1 Separation of Concerns
- Frontend and backend must remain logically separated
- Next.js 16+ (App Router) handles all client-side concerns
- FastAPI (Python) handles all server-side concerns
- Communication occurs exclusively through RESTful APIs

### 1.2 Monorepo Structure
- All code for frontend and backend exists within a single repository
- Clear directory separation between frontend and backend code
- Shared configurations and utilities must be placed in designated shared directories

### 1.3 Spec-First Development
- No manual coding without corresponding specifications
- All features must be documented in spec files before implementation
- Implementation must strictly adhere to the specifications
- Deviations from spec require spec updates before code changes

## 2. Security Principles

### 2.1 Mandatory Authentication
- JWT authentication is required for all API endpoints
- Unauthenticated requests must return HTTP 401 Unauthorized
- Authentication tokens must be validated on every protected route

### 2.2 User Data Isolation
- User data must be isolated at all application layers
- Users can only access their own data
- Cross-user data access is strictly prohibited
- All queries must include user_id filters where applicable

### 2.3 Shared Secrets
- A shared secret is required between frontend and backend
- Secret must be stored securely using environment variables
- Secret rotation mechanism must be implemented

## 3. API Principles

### 3.1 RESTful Design
- All APIs must follow RESTful design principles
- Proper HTTP methods must be used (GET, POST, PUT, DELETE)
- Resource-based URL structures are mandatory

### 3.2 API Endpoint Structure
- All API routes must be under the `/api` path
- No exceptions to the `/api` prefix rule
- Consistent URL naming conventions must be maintained

### 3.3 Data Format Requirements
- All requests and responses must use JSON format
- Proper HTTP status codes must be returned for all responses
- Error responses must follow a consistent structure

## 4. Data Principles

### 4.1 Data Storage
- All persistent data must be stored in Neon Serverless PostgreSQL
- No alternative storage mechanisms without explicit approval
- Database schema changes must be handled through proper migration procedures

### 4.2 User-Data Association
- All tasks must be associated with a user_id
- User_id must be included as a foreign key in all user-specific data tables
- Queries must enforce user_id filtering for security

### 4.3 Data Access Controls
- No direct database access from frontend
- All database operations must go through backend API endpoints
- Cross-user data access is forbidden at the application level

## 5. Development Rules

### 5.1 Specification Governance
- Specifications must be updated before changing behavior
- Implementation must never precede specification
- Code reviews must verify alignment with specifications

### 5.2 Agent and Skill Compliance
- All agents must follow defined skill patterns
- Skills must be reusable and consistent across agents
- Custom skills must follow established conventions

### 5.3 Quality Assurance
- All code must pass automated tests before merging
- Proper error handling must be implemented for all edge cases
- Logging must be implemented at appropriate levels

## 6. Phase Scope

### 6.1 Phase 2 Boundaries
- This constitution applies specifically to Phase 2
- Features are limited to task CRUD operations and authentication
- Additional features require constitution updates

### 6.2 Feature Limitations
- Current scope includes: Create, Read, Update, Delete operations for tasks
- Current scope includes: User authentication and session management
- Out-of-scope features require explicit approval and constitution amendments

## 7. Enforcement

### 7.1 Violation Consequences
- Code that violates these principles will be rejected in review
- Automated checks may prevent merging of non-compliant code
- Team members are responsible for enforcing these rules

### 7.2 Amendment Process
- Changes to this constitution require team consensus
- Amendments must be documented and versioned
- All affected specifications must be updated when constitution changes
