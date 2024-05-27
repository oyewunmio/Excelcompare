from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql://postgres:qwertyui8@localhost/postgres"
engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
