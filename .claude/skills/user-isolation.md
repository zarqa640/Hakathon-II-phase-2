---
name: user-isolation
version: "1.0"
author: Claude Code
category: security
tags: [data-isolation, authentication, authorization, privacy]
---

# User Data Isolation Skill

## Purpose

This skill defines the security mechanism to ensure that authenticated users can only access their own data. It enforces data isolation by validating that the user ID from the JWT token matches the user ID in the API route and database records, preventing unauthorized access to other users' data.

## Rules

### User ID Matching
- Extract user ID from the authenticated JWT token
- Compare with user ID parameter in the API route (e.g., `/api/users/{user_id}/tasks`)
- Ensure both user IDs match before proceeding with the request
- Use strict equality comparison (no type coercion)

### Database Query Filtering
- Automatically append user ID filter to all database queries
- Modify WHERE clauses to include user_id condition
- Apply user-specific filters to SELECT, UPDATE, DELETE operations
- Never allow queries without user-specific filters in authenticated endpoints

### Access Validation
- Verify user permissions before executing any data operations
- Perform validation checks on both route parameters and JWT claims
- Implement consistent validation across all API endpoints
- Log all access attempts for audit purposes

## Forbidden Scenarios

### Cross-User Access Attempt
- A user attempting to access resources belonging to another user
- API call with mismatched user ID in route versus JWT token
- Database query attempting to access records without proper user filter

### Unfiltered Queries
- Database operations without user ID constraints
- Bulk operations that could affect multiple users' data
- Administrative queries that bypass user isolation (unless explicitly allowed)

### Bypass Attempts
- Manipulation of JWT tokens to impersonate other users
- Direct database access attempts bypassing API authentication
- Parameter tampering to access unauthorized resources

## Agents That Use This Skill

- **fastapi-backend-dev**: To implement user-isolated API endpoints with proper validation
- **database-agent**: To design database schemas and queries with user isolation in mind
- **auth-system-architect**: To ensure authentication flows properly enforce user isolation
- **nextjs-frontend-dev**: To construct API calls with correct user context