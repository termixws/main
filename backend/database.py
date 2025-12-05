from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
import os

SUPABASE_DB_URL = os.environ.get(
    'SUPABASE_DB_URL',
    'postgresql://postgres:postgres@localhost:5432/salon_natasha'
)

engine = create_engine(
    SUPABASE_DB_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def init_db():
    SQLModel.metadata.create_all(engine)
