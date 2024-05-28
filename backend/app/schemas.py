from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    is_active: bool = True

class UserLogin(BaseModel):
    username: str
    pin: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    sub: str | None = None
    
class UserUpdate(BaseModel):
    id: int
    username: str
    password: str
    user_role: str = "user"
    is_active: bool
    