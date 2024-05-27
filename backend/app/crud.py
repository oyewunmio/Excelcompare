from sqlmodel import Session, select
from models import User, Log
from datetime import datetime

def get_user_by_username(*, session: Session, username: str) -> User | None:
    statement = select(User).where(User.username== username)
    session_user = session.exec(statement).first()
    return session_user


def create_log(session: Session, username: str, differences):
    log = Log(username=username, log_time=datetime.utcnow(), document_differences=differences)
    session.add(log)
    session.commit()
    session.refresh(log)
    return log

def read_log(session: Session):
    statement = select(Log)
    logs = session.exec(statement).all()
    return logs
