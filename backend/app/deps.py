from sqlmodel import Session
from database import engine
from typing import Generator, Annotated
from config import settings
from fastapi import Depends, HTTPException, status
from utils import verify_token_access
from models import User
from fastapi.security import OAuth2PasswordBearer


reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/auth/login"
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    token_data = verify_token_access(token)
    user = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_admin_user(user: User = Depends(get_current_user)):
    if user.user_role != "admin":
        raise HTTPException(status_code=403, detail="User does not have admin privileges")
    return user