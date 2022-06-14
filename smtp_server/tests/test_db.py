import os
import pytest
from sqlalchemy.engine import create_engine
from sqlalchemy.orm import declarative_base, Session
from sqlalchemy.schema import MetaData
from ..pydantic_models import *
from ..db import *


@pytest.fixture
def sqlalchemy_engine():
    engine = create_engine(
        f"postgresql://{os.environ['TEST_POSTGRES_USERNAME']}:{os.environ['TEST_POSTGRES_PASSWORD']}@{os.environ['TEST_DB_HOST']}:{os.environ['TEST_DB_PORT']}",
        echo=True, future=True)
    return engine


@pytest.fixture
def sqlalchemy_base(sqlalchemy_engine):
    Base = declarative_base(bind=sqlalchemy_engine)
    return Base


@pytest.fixture
def sqlalchemy_session(sqlalchemy_engine):
    session = Session(sqlalchemy_engine)

    return session


def test_users_table(sqlalchemy_base, sqlalchemy_engine, sqlalchemy_session):
    # Drop all tables
    meta = MetaData(bind=sqlalchemy_engine)
    meta.drop_all(bind=sqlalchemy_engine)
    # Create tables
    meta.create_all(bind=sqlalchemy_engine)

    # Create user
    user: Users = Users(user_uid="test")

