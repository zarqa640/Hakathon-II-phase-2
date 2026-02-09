# Data Model: Phase 2 Full-Stack Todo Web Application

**Feature**: 001-spec-constitution-translation
**Date**: 2026-02-05
**Author**: Spec-Kit

## Overview

This document defines the data entities and their relationships for the Phase 2 Full-Stack Todo Web Application. It captures the key entities identified in the specification and provides details on their structure, relationships, and constraints.

## Entity Definitions

### User Entity
**Description**: Represents a registered user of the system with authentication credentials and profile information

**Fields**:
- `id` (UUID/Integer): Unique identifier for the user
- `email` (String): User's email address (unique, required)
- `password_hash` (String): Securely hashed password (required)
- `first_name` (String, optional): User's first name
- `last_name` (String, optional): User's last name
- `created_at` (DateTime): Timestamp when user was created
- `updated_at` (DateTime): Timestamp when user was last updated
- `is_active` (Boolean): Whether the user account is active

**Validation Rules**:
- Email must be valid and unique
- Password must meet security requirements (length, complexity)
- Email cannot be changed after registration

### Task Entity
**Description**: Represents a user's task with properties like title, description, completion status, due date, and user association

**Fields**:
- `id` (UUID/Integer): Unique identifier for the task
- `title` (String): Title of the task (required)
- `description` (Text, optional): Detailed description of the task
- `is_completed` (Boolean): Whether the task is completed (default: false)
- `due_date` (DateTime, optional): Date when the task is due
- `user_id` (UUID/Integer): Foreign key linking to the owning user (required)
- `created_at` (DateTime): Timestamp when task was created
- `updated_at` (DateTime): Timestamp when task was last updated

**Validation Rules**:
- Title must be provided (non-empty)
- Due date must be in the future if provided
- Task must belong to a valid user
- Only the owner can modify the task

### Authentication Token Entity
**Description**: Represents JWT tokens used for authentication and session management

**Fields**:
- `id` (UUID/Integer): Unique identifier for the token record
- `token_hash` (String): Hashed representation of the JWT token (required)
- `user_id` (UUID/Integer): Foreign key linking to the user (required)
- `expires_at` (DateTime): When the token expires (required)
- `created_at` (DateTime): When the token was issued
- `revoked` (Boolean): Whether the token has been revoked

**Validation Rules**:
- Token must not be expired
- Revoked tokens cannot be used for authentication
- Tokens are linked to exactly one user

## Relationships

### User ↔ Task Relationship
- **Type**: One-to-Many
- **Description**: One user can have many tasks
- **Constraint**: When a user is deleted, their tasks must also be deleted (cascade delete)
- **Access Control**: Users can only access tasks associated with their user_id

### User ↔ Authentication Token Relationship
- **Type**: One-to-Many
- **Description**: One user can have multiple active authentication tokens
- **Constraint**: Each token belongs to exactly one user

## Database Constraints

### Referential Integrity
- Foreign key constraints ensure that all tasks reference valid users
- All authentication tokens must reference valid users
- No orphaned records allowed

### Unique Constraints
- User email addresses must be unique across the system
- No duplicate email addresses allowed

### Indexing Recommendations
- Index on `users.email` for fast authentication lookups
- Index on `tasks.user_id` for efficient user-specific queries
- Index on `auth_tokens.token_hash` for fast token validation
- Index on `auth_tokens.expires_at` for efficient token cleanup

## Data Access Patterns

### User-Specific Access
- All queries retrieving tasks must include a user_id filter
- The application layer must enforce user_id filtering
- Direct database access from frontend is prohibited

### Authentication Validation
- All API requests must validate the presence of a valid authentication token
- Token expiration must be checked for each protected request
- Revoked tokens must be rejected immediately

## Data Lifecycle

### User Data
- User accounts can be deactivated but not immediately deleted
- Personal data should be retained according to privacy regulations
- Tasks are deleted when the associated user is deleted

### Task Data
- Tasks can be marked as completed but not deleted by default
- Completed tasks may be archived after a certain period
- Users can permanently delete their tasks if desired

### Authentication Token Data
- Tokens expire automatically after a set period
- Revoked tokens are marked as such but retained for audit purposes
- Expired tokens are cleaned up periodically