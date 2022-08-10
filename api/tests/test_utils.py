import time
from datetime import datetime, timedelta
from passlib.hash import sha256_crypt
from fastapi.testclient import TestClient
from ..utils import *
from .test_main import test_user
from ..main import app
import pytest


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


def test_password_hashing():
    password = "secret_test_password"
    hashed_password = sha256_crypt.hash(password)
    assert verify_password(password=password, hashed_password=hashed_password) is True
    wrong_password = "wrong_test_password"
    assert verify_password(password=wrong_password, hashed_password=hashed_password) is False


def test_access_token(test_user):
    #  Expired access token
    expired_access = create_access_token(data={
        'sub': test_user.uuid
    }, expires_delta=timedelta(milliseconds=50))
    time.sleep(1)

    # Valid access token
    valid_access = create_access_token(data={
        'sub': test_user.uuid
    }, expires_delta=timedelta(minutes=5))

    # Create refresh token
    refresh_token = create_access_token(data={
        'sub': test_user.uuid
    }, expires_delta=timedelta(minutes=5))

    # Request protected endpoint with invalid access. (No refresh)
    response = client.get(url=f'/getEmails/{test_user.uuid}', headers={
        'Authorization': f'Bearer {expired_access}'
    })
    # 401 Unauthorized
    assert access_token_not_expired(expired_access) is False
    assert response.status_code == 401

    # Valid access. (No refresh)
    response = client.get(url=f'/getEmails/{test_user.uuid}', headers={
        'Authorization': f'Bearer {valid_access}'
    })
    assert response.status_code == 200

    # Request protected endpoint with valid access. (Valid refresh)
    response = client.get(url=f'/getEmails/{test_user.uuid}', headers={
        'Authorization': f'Bearer {valid_access}',
        'refresh_token': refresh_token
    })
    assert response.status_code == 200

    # Invalid access. Valid refresh.
    response = client.get(
        url=f'/getEmails/{test_user.uuid}',
        headers={
            'Authorization': f'Bearer {expired_access}',
            'refresh_token': refresh_token
        })
    assert response.status_code == 200

    # Request protected route without any tokens
    response = client.get(url=f'/getEmails/{test_user.uuid}')
    assert response.status_code == 403
