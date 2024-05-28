from argon2 import PasswordHasher
from sqlmodel import Session
from models import User
from schemas import TokenData
from crud import get_user_by_username
from datetime import datetime, timedelta
from jose import jwt, JWTError
from config import settings
from typing import Any
from pydantic import ValidationError
from fastapi import HTTPException, status

ph = PasswordHasher()

def authenticate(*, session: Session, username: str, password: str) -> User | None:
    db_user = get_user_by_username(session=session, username=username)
    if not db_user:
        return None
    if not verify_password(password, db_user.password):
        return None
    return db_user

def verify_password(hashed_password: str, plain_password: str) -> bool:
    try:
        print(hashed_password, plain_password)
        ph.verify(plain_password, hashed_password)
        return True
    except:
        return False

def hash_password(password: str) -> str:
    return ph.hash(password)


def create_token(subject: str | Any):
    expire = datetime.utcnow() + timedelta(
        hours=settings.JWT_EXPIRE
    )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def verify_token_access(token: str):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=settings.ALGORITHM
        )  # noqa
        token_data = TokenData(**payload)
    except (JWTError, ValidationError) as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"{e}",
        )
    return token_data