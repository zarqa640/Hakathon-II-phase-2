"""JWT token verification for Better Auth integration."""

from jose import jwt, JWTError, ExpiredSignatureError
from fastapi import HTTPException, status

from .config import get_settings

# JWT Configuration
ALGORITHM = "HS256"


def decode_jwt(token: str) -> dict:
    """
    Decode and verify a JWT token using the shared Better Auth secret.

    Args:
        token: The JWT token string to decode

    Returns:
        dict: The decoded token payload

    Raises:
        HTTPException: 401 if token is invalid, expired, or malformed
    """
    settings = get_settings()

    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[ALGORITHM],
        )
        return payload

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_user_id_from_token(token: str) -> str:
    """
    Extract user_id from JWT token's 'sub' claim.

    Args:
        token: The JWT token string

    Returns:
        str: The user_id from the token

    Raises:
        HTTPException: 401 if token is invalid or missing 'sub' claim
    """
    payload = decode_jwt(token)

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user identifier",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return str(user_id)
