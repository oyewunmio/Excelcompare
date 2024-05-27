from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    user_role: str
    password: str

class UserLogin(BaseModel):
    username: str
    pin: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: str | None = None