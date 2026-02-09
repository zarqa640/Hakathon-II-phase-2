"""Task CRUD API endpoints."""

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from typing import List

from ..deps import CurrentUser, DBSession
from ...models.task import Task
from ...schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter()


@router.get("/tasks", response_model=List[TaskResponse])
def list_tasks(user_id: CurrentUser, session: DBSession) -> List[Task]:
    """
    List all tasks for the authenticated user.

    Returns only tasks belonging to the current user (filtered by user_id from token).
    """
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    tasks = session.exec(statement).all()
    return tasks


@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_data: TaskCreate, user_id: CurrentUser, session: DBSession) -> Task:
    """
    Create a new task for the authenticated user.

    The user_id is automatically assigned from the JWT token.
    """
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: CurrentUser,
    session: DBSession,
) -> Task:
    """
    Update an existing task.

    Only the task owner can update the task. Returns 404 if task not found
    or not owned by the current user (prevents information leakage).
    """
    # Query by id AND user_id for ownership verification
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Update only provided fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, user_id: CurrentUser, session: DBSession) -> None:
    """
    Delete a task.

    Only the task owner can delete the task. Returns 404 if task not found
    or not owned by the current user (prevents information leakage).
    """
    # Query by id AND user_id for ownership verification
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    session.delete(task)
    session.commit()
