import uuid
from datetime import datetime, timedelta
import os

import jose.jwt
from jose import jwt
from passlib.hash import sha256_crypt
from sqlalchemy.orm import Session
from db import engine, Users
from fastapi import Depends
from fastapi.security import HTTPBearer

security = HTTPBearer()


def generate_uuid():
    return uuid.uuid4()


def hash_password(password):
    return sha256_crypt.hash(password)


def verify_password(password: str, hashed_password: str):
    return sha256_crypt.verify(password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.environ['SECRET_KEY'])
    return encoded_jwt


def validate_access_token(access_token):
    """
    Validates JWT
    :param access_token: str - JWT access token
    :return bool - True/False depending on JWT validity
    """
    try:
        data: dict = jose.jwt.decode(token=access_token, key=os.environ['SECRET_KEY'])
        if data:
            return True

    except:
        return False


def wipe_test_users():
    """ Removes all users with an email_address prefixed with "test" """
    with Session(engine) as session:
        for user in session.query(Users).all():
            if user.email_address.startswith("test"):
                session.delete(user)
        session.commit()


def get_authorization_header(token: str | None = Depends(security)):
    return token



