import os
from sqlalchemy.orm import declarative_base, relationship, Session
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.engine import create_engine


engine = create_engine(f"postgresql://{os.environ['POSTGRES_USERNAME']}:{os.environ['POSTGRES_PASSWORD']}@{os.environ['DB_HOST']}:{os.environ['DB_PORT']}",
                       echo=True, future=True)

Base = declarative_base(bind=engine)
session = Session(engine)


class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    user_uid = Column(String(512), nullable=False, unique=True)

    # 1-to-1 relationship to Accounts table
    account = relationship('Accounts', back_populates='user', uselist=False)

    # M2M relationship to emails table
    emails = relationship('Emails', secondary='user_emails', back_populates='users')


class Accounts(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True)

    # Email address linked to account
    email_address = Column(String(320), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    user = relationship('Users', back_populates='account')


class Emails(Base):
    __tablename__ = 'emails'

    id = Column(Integer, primary_key=True)
    subject = Column(String(70), nullable=False)
    sender = Column(String(320), nullable=False)
    recipients = Column(String, nullable=False)
    message = Column(String, nullable=False)

    users = relationship('Users', secondary='user_emails', back_populates='emails')


class UserEmails(Base):
    __tablename__ = 'user_emails'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    emails_id = Column(Integer, ForeignKey('emails.id'))


# Create tables
Base.metadata.create_all(engine)


