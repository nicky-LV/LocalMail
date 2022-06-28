import os
import pytest
from sqlalchemy.schema import MetaData
from sqlalchemy.exc import MultipleResultsFound
from sqlalchemy.orm import declarative_base, relationship, Session
from sqlalchemy import Column, String, Integer, ForeignKey, or_
from sqlalchemy.engine import create_engine
from sqlalchemy.dialects.postgresql import UUID
from ..pydantic_models import *
from ..utils import *
from ..db import *


def test_create_tables():
    Base.metadata.create_all(bind=engine)
    print(f"Tables created: {Base.metadata.tables}")


def test_users_table():
    # --- Creates test user, if it doesn't already exist ---
    email_address = f"test@{os.environ.get('DOMAIN')}.{os.environ.get('TLD')}"

    # Check if test user exists (via test email_address)
    try:
        # User exists
        if session.query(Users).filter(Users.email_address == email_address).scalar() is not None:
            pass

        # User doesn't exist, create one.
        else:
            uuid: UUID = generate_uuid()
            user: Users = Users(uuid=uuid, email_address=email_address)

            # Commit user object to session
            session.add(user)
            session.commit()

            # Test to see if user has been added
            assert session.query(Users).filter(Users.uuid == uuid).scalar() is not None

    except MultipleResultsFound:
        raise Exception("There are multiple users with the same email address. Email addresses should be unique. "
                        "Remove users with the same email address and try again.")


def test_email_crud():
    """ Tests CRUD operations on "emails" table. """

    # Wipe existing test users
    wipe_test_users()

    # Create test users
    test_user_1: Users = Users(uuid=generate_uuid(), email_address="test@test.com")
    test_user_2: Users = Users(uuid=generate_uuid(), email_address="test2@test.com")
    test_user_3: Users = Users(uuid=generate_uuid(), email_address="test3@test.com")
    session.add(test_user_1)
    session.add(test_user_2)
    session.add(test_user_3)

    # Create test email
    test_email: Emails = Emails(subject="Test", sender=test_user_1.email_address,
                                body="Test message")

    # Populate relationship
    test_email.users.append(test_user_1)
    test_email.users.append(test_user_2)
    test_email.users.append(test_user_3)

    session.add(test_email)
    session.commit()

    q = session.query(Emails).filter(Emails.id == test_email.id).scalar()

    # Assert row exists.
    assert q is not None

    # Assert relationships work correctly. (Senders/recipients are linked to the email)
    assert test_user_1 in q.users
    assert test_user_2 in q.users
    assert test_user_3 in q.users

    # Assert that the emails are related to the users.
    assert q in test_user_1.emails
    assert q in test_user_2.emails
    assert q in test_user_3.emails



