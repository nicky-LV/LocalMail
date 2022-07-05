import uuid
from datetime import datetime, timedelta
import os
import jose
from jose.exceptions import ExpiredSignatureError
from passlib.hash import sha256_crypt
from sqlalchemy.orm import Session
from db import engine, Users
from fastapi import Depends, Request, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()


def generate_uuid() -> str:
    return uuid.uuid4().hex


def hash_password(password: str) -> str:
    return sha256_crypt.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return sha256_crypt.verify(password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jose.jwt.encode(to_encode, os.environ['SECRET_KEY'])
    return encoded_jwt


def access_token_not_expired(access_token: str):
    """
    Validates JWT
    :param access_token: str - JWT access token
    :return bool - True/False depending on JWT validity
    """
    try:
        data: dict = jose.jwt.decode(token=access_token, key=os.environ['SECRET_KEY'])
        if data:
            return True

    except Exception:
        return False


def wipe_test_users():
    """ Removes all users with an email_address prefixed with "test" """
    with Session(engine) as session:
        for user in session.query(Users).all():
            if user.email_address.startswith("test"):
                session.delete(user)
        session.commit()


def access_token(request: Request, token: dict = Depends(security)) -> str | HTTPException:
    """
    Returns a valid access token from the request. (Refreshes it if it's expired and there is a valid refresh token).
    :param request: Request
    :param token: str = Depends(HTTPBearer()) The Bearer token in the Authorization header
    :return: Access token: str
    :return: HTTPException - If the access token has expired and it cannot be refreshed. (no refresh token / expired
    refresh token)
    """
    token = token.credentials

    if access_token_not_expired(access_token=token):
        # Access valid
        if 'refresh_token' in request.headers.keys():
            refresh_token = request.headers['refresh_token']
            if access_token_not_expired(refresh_token):
                # Refresh token is valid. Refresh the token.
                token = refresh_access_token(token, refresh_token)

        return token

    else:
        # Access invalid
        if 'refresh_token' in request.headers.keys():
            refresh_token = request.headers['refresh_token']

            if access_token_not_expired(refresh_token):
                # Refresh valid. Create new access.
                token = refresh_access_token(token, refresh_token)
                return token

            # Refresh invalid. Raise error
            else:
                raise HTTPException(status_code=401)

        else:
            # No refresh. Raise error
            raise HTTPException(status_code=401)


def refresh_access_token(access_token: str, refresh_token: str):
    # Check that refresh token is not expired
    if access_token_not_expired(refresh_token):
        # Refresh access token
        access_token: str = create_access_token(data={
            'sub': jose.jwt.decode(refresh_token, os.environ['SECRET_KEY'])['sub']
        }, expires_delta=timedelta(days=1))

        return access_token

    # Refresh token is expired, return expired access token
    else:
        return access_token




