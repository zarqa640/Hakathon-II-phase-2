"""Database connection and session management using SQLModel."""

from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy.exc import OperationalError
from fastapi import HTTPException, status
from typing import Generator

from .config import get_settings

# Create engine with settings
settings = get_settings()
engine = create_engine(
    settings.database_url,
    echo=False,  # Set to True for SQL query logging
    pool_pre_ping=True,  # Verify connections before use
)


def create_db_and_tables() -> None:
    """Create all database tables from SQLModel metadata."""
    try:
        SQLModel.metadata.create_all(engine)
    except OperationalError as e:
        # Log the error but don't crash - tables might already exist
        print(f"Database initialization warning: {e}")


def get_session() -> Generator[Session, None, None]:
    """Dependency that provides a database session."""
    try:
        with Session(engine) as session:
            yield session
    except OperationalError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed. Please try again later.",
        )
