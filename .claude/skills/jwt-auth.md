---
name: jwt-auth
version: "1.0"
author: Claude Code
category: security
tags: [jwt, authentication, authorization]
---

# JWT Authentication Skill

## Purpose

This skill defines the process for authenticating users using JSON Web Tokens (JWT). It covers how JWTs are extracted from HTTP headers, verified using a shared secret, and how user identity is decoded from the token. It also specifies how to handle various failure scenarios to ensure secure authentication.

## Verification Steps

### Extract JWT from Authorization Header
1. Parse the Authorization header for the "Bearer {token}" format
2. Extract the JWT token string from the header
3. Validate that the token exists and is properly formatted

### Verify JWT Using Shared Secret
1. Decode the JWT header and payload without verification
2. Verify the token signature using the stored shared secret
3. Check the algorithm matches the expected algorithm
4. Ensure the token has not been tampered with

### Decode User Identity
1. Extract user ID, username, or email from the payload
2. Validate token expiration time (exp claim)
3. Validate token issued-at time (iat claim) if applicable
4. Verify any additional claims required by the application
5. Return user identity information for downstream use

## Failure Handling

### Missing Token
- Return HTTP 401 Unauthorized status
- Include error message indicating token is required
- Log attempt for monitoring purposes

### Invalid Token
- Return HTTP 401 Unauthorized status
- Include error message indicating token is malformed or invalid
- Log attempt for security monitoring
- Optionally trigger account lockout after repeated failures

### Expired Token
- Return HTTP 401 Unauthorized status
- Include error message indicating token has expired
- Provide guidance to refresh token if applicable
- Log event for user notification purposes

### Verification Failure
- Return HTTP 401 Unauthorized status
- Include generic error message to prevent token validation attacks
- Log the incident for security analysis
- Do not reveal specific reasons for verification failure

## Agents That Use This Skill

- **auth-system-architect**: To implement JWT authentication systems
- **fastapi-backend-dev**: To secure API endpoints with JWT middleware
- **nextjs-frontend-dev**: To properly attach JWT tokens to API requests
- **database-agent**: To ensure proper user data isolation based on JWT claims