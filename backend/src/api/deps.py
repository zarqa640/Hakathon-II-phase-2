"""FastAPI dependencies for authentication and database sessions."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from typing import Annotated

from ..core.database import get_session
from ..core.security import get_user_id_from_token

# Security scheme for Bearer token authentication
security = HTTPBearer()


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    """
    Dependency that extracts and validates the current user from JWT token.

    Args:
        credentials: The HTTP Authorization credentials (Bearer token)

    Returns:
        str: The user_id extracted from the valid JWT token

    Raises:
        HTTPException: 401 if no token provided or token is invalid
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    return get_user_id_from_token(token)


# Type aliases for cleaner dependency injection
CurrentUser = Annotated[str, Depends(get_current_user)]
DBSession = Annotated[Session, Depends(get_session)]
