import datetime
import os
from sqlalchemy.orm import declarative_base, relationship, Session
from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, delete
from sqlalchemy.engine import create_engine
from sqlalchemy.dialects.postgresql import UUID, ENUM
from sqlalchemy import event, Enum


if int(os.environ['TEST_DB']) == 0:
    engine = create_engine(f"postgresql://{os.environ['POSTGRES_USERNAME']}:{os.environ['POSTGRES_PASSWORD']}@{os.environ['DB_HOST']}:{os.environ['DB_PORT']}",
                           future=True)

    Base = declarative_base(bind=engine)
    session = Session(engine)

else:
    engine = create_engine(
        f"postgresql://{os.environ['TEST_POSTGRES_USERNAME']}:{os.environ['TEST_POSTGRES_PASSWORD']}@{os.environ['TEST_DB_HOST']}:{os.environ['TEST_DB_PORT']}",
        echo=True, future=True)

    Base = declarative_base(bind=engine)
    session = Session(engine)


class Users(Base):
    __tablename__ = 'users'
    uuid = Column(UUID(as_uuid=False), nullable=False, primary_key=True)
    firstname = Column(String(40), nullable=False, default="")
    surname = Column(String(40), nullable=False, default="")
    email_address = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    disabled = Column(Boolean, nullable=False, default=False)

    # M2M relationship to emails table
    emails = relationship('Emails', secondary='user_emails', back_populates='recipients')

    def __repr__(self):
        return f"User {self.uuid}: {self.email_address}"


class Emails(Base):
    __tablename__ = 'emails'

    id = Column(Integer, primary_key=True)
    subject = Column(String(70), nullable=True)
    sender = Column(String(320), nullable=False)
    body = Column(String, nullable=True)
    retrieved = Column(Boolean, nullable=False, default=False)
    datetime = Column(DateTime, nullable=False, default=datetime.datetime.utcnow())
    folder = Column(ENUM("Inbox", "Archived", "Trash", name='folder_enum'), nullable=False, default="Inbox")
    # Specifies if email is a backup or not
    backup = Column(Boolean, nullable=False, default=False)

    recipients = relationship('Users', secondary='user_emails', back_populates='emails')

    def __repr__(self):
        return f"ID: {self.id} | Subject: {self.subject}"


class UserEmails(Base):
    __tablename__ = 'user_emails'

    id = Column(Integer, primary_key=True)
    user_uuid = Column(UUID(as_uuid=False), ForeignKey('users.uuid'))
    emails_id = Column(Integer, ForeignKey('emails.id'))
