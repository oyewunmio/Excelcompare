from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql://thoth:mWxyGn3ykRlm732OyuRDKM1RaAgPllNW@dpg-cpau3mm3e1ms73a00mug-a.oregon-postgres.render.com/excelcompare"
engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
