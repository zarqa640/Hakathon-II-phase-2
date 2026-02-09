---
name: spec-to-code
version: "1.0"
author: Claude Code
category: methodology
tags: [specification, sdd, development-process]
---

# Specification to Code Skill

## Purpose

This skill defines the methodology for converting written specifications into code implementations. It ensures that all development work is grounded in well-defined specifications, preventing feature creep, inconsistent implementations, and deviations from agreed-upon requirements. This approach promotes disciplined development where specifications drive implementation rather than assumptions or ad-hoc decisions.

## Rules

### Specification-First Approach
- Always read and understand the complete specification before beginning any coding
- Identify all acceptance criteria and functional requirements in the spec
- Clarify ambiguous requirements with stakeholders before implementation
- Reference specific sections of the specification during development

### No Assumptions Outside Specifications
- Do not implement features or behaviors not explicitly defined in the specification
- Avoid "nice-to-have" additions that aren't part of the spec
- When encountering gaps in specifications, request clarification rather than guessing
- Document any assumptions made during implementation for review

### Change Through Specification Updates
- When requirements change, update the specification before modifying code
- Submit specification changes for review and approval before implementation
- Maintain traceability between specification sections and code implementations
- Ensure code changes align with updated specification versions

## Workflow Steps

### 1. Specification Analysis
- Read the complete specification document
- Identify all functional and non-functional requirements
- List acceptance criteria for the feature
- Note any dependencies or constraints mentioned

### 2. Implementation Planning
- Map specification requirements to technical components
- Identify which files/classes/functions need to be created or modified
- Plan test cases based on acceptance criteria
- Estimate effort and potential challenges

### 3. Code Implementation
- Implement features as specified without adding extras
- Write tests that verify against specification requirements
- Follow architectural patterns outlined in the spec
- Ensure code comments reference relevant specification sections

### 4. Verification Against Spec
- Verify all acceptance criteria are met
- Check that no additional functionality was inadvertently added
- Ensure edge cases mentioned in the spec are handled
- Confirm non-functional requirements are satisfied

### 5. Specification Alignment Review
- Cross-reference implemented features with original spec
- Document any deviations and rationale
- Update specification if implementation reveals missing requirements
- Ensure traceability between spec and code

## Agents That Use This Skill

- **nextjs-frontend-dev**: To implement frontend features based on specifications
- **fastapi-backend-dev**: To develop backend APIs following specification requirements
- **database-agent**: To design schemas based on specified data requirements
- **auth-system-architect**: To implement authentication systems per specification
- **general-purpose**: To ensure specification compliance during general development tasks