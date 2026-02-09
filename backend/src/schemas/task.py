"""Pydantic schemas for Task request/response validation."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(
        default=None, max_length=2000, description="Optional task description"
    )


class TaskUpdate(BaseModel):
    """Schema for updating an existing task."""

    title: Optional[str] = Field(
        default=None, min_length=1, max_length=255, description="Updated task title"
    )
    description: Optional[str] = Field(
        default=None, max_length=2000, description="Updated task description"
    )
    completed: Optional[bool] = Field(
        default=None, description="Task completion status"
    )


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True
