import json
import random
import string
import os
from datetime import datetime, timedelta
import pytest
from fastapi.testclient import TestClient
from ..main import app
from sqlalchemy.orm import Session
from ..db import engine, Users
from ..utils import *

client = TestClient(app)


@pytest.fixture
def test_user():
    with Session(engine) as session:
        user = session.query(Users).filter(Users.email_address == 'test@test.com').scalar()
        if user:
            return user

        else:
            # Create test user if it doesn't exist
            db_user = Users(uuid=generate_uuid(), email_address='test@test.com', password=hash_password('test'))
            session.add(db_user)
            session.commit()

            return session.query(Users).filter(Users.email_address == 'test@test.com').scalar()


def test_signup_valid_credentials():
    """ Tests that a JWT token is received (signs up a random email address) """
    email_username = ''.join(random.choice(string.ascii_lowercase) for i in range(10))
    email_address = f'{email_username}@{os.environ["DOMAIN"]}.{os.environ["TLD"]}'

    response = client.post("/signup", json={
        'email_address': email_address,
        'password': 'password'
    })

    assert response.status_code == 200
    assert 'access_token' in response.json().keys()


def test_signup_invalid_credentials():
    """ Tests that the /signnup endpoint returns a 400 code if the email is invalid"""

    # Invalid email (incorrect domain and tld)
    email_address = f'test@invalid_domain.invalid_tld'
    response = client.post("/signup", json={
        'email_address': email_address,
        'password': 'password'
    })

    assert response.status_code == 400


def test_login_valid_credentials(test_user):
    assert json.dumps({
        'email_address': test_user.email_address,
        'password': test_user.password
    })
    response = client.post('/login', json={
        'email_address': test_user.email_address,
        'password': 'test'
    })

    assert response.status_code == 200


def test_login_invalid_credentials(test_user):
    response = client.post('/login', json={
        'email_address': test_user.email_address,
        'password': 'INCORRECT_PASSWORD'
    })

    assert response.status_code == 400
    assert response.content == b'Email or password is invalid'

    response = client.post('/login', json={
        'email_address': f'falsetest@{os.environ["DOMAIN"]}.{os.environ["TLD"]}',
        'password': test_user.password
    })

    assert response.status_code == 400
    assert response.content == b'Email or password is invalid'