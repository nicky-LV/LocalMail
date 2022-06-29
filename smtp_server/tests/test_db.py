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


def test_user_email_relationship():
    """ Tests Users and Emails relationship / cascade works as intended. """

    # Wipe existing test users
    wipe_test_users()

    # Create test users
    test_user_1: Users = Users(uuid=generate_uuid(), email_address="test@test.com")
    test_user_2: Users = Users(uuid=generate_uuid(), email_address="test2@test.com")
    test_user_3: Users = Users(uuid=generate_uuid(), email_address="test3@test.com")

    test_users = [test_user_1, test_user_2, test_user_3]

    # Add users to session.
    for user in test_users:
        session.add(user)

    # Create test emails
    email_1: Emails = Emails(subject="test_email_1", sender=test_user_1.email_address,
                                body="test_email_1")

    email_2: Emails = Emails(subject="test_email_2", sender=test_user_1.email_address,
                                body="test_email_2")

    test_emails = [email_1, email_2]

    # Populate 'users' relationship for emails
    for email in test_emails:
        for user in test_users:
            email.users.append(user)

    # Add emails to session
    for email in test_emails:
        session.add(email)

    # Commit session
    session.commit()

    q1 = session.query(Emails).filter(Emails.id == email_1.id).scalar()
    q2 = session.query(Emails).filter(Emails.id == email_2.id).scalar()

    # Assert emails exist
    assert q1 is not None
    assert q2 is not None

    # Assert that the emails are related to the user
    for email in test_emails:
        for user in test_users:
            assert email in user.emails

    # Assert that the users are back-related to the email.
    for user in test_users:
        assert user in q1.users
        assert user in q2.users

    # Delete the first email.
    session.delete(q1)
    session.commit()

    # Assert the cascades (from a related emails' deletion) works correctly.
    for user in test_users:
        # Assert user still exists
        assert session.query(Users).filter(Users.uuid == user.uuid).scalar() is not None
        # Assert that the email is unlinked from the user.
        assert q2 in user.emails
        assert q1 not in user.emails

    # Delete the users - assert that the cascade works correctly.
    wipe_test_users()

    # Assert that q2 has no related users and that it still exists.
    assert q2.users == []
    assert q2 is not None





