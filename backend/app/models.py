from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    user_role: str = "user"
    password: str
    is_active: Optional[bool] = True

class Log(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str
    log_time: datetime = Field(default_factory=datetime.utcnow)
    document_differences: str
    interface: str = "Web"

