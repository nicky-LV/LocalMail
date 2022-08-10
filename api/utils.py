import uuid
from datetime import datetime, timedelta
import os
import jose
from jose.exceptions import ExpiredSignatureError, JWTClaimsError
from passlib.hash import sha256_crypt
from sqlalchemy.orm import Session
from db import engine, Users, Emails
from fastapi import Depends, Request, HTTPException
from fastapi.security import HTTPBearer
from typing import List
from pydantic_models import Email, API_EMAIL

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


def get_jwt_subject(token: str):
    return jose.jwt.decode(token, os.environ['SECRET_KEY'], options={'verify_exp': False})['sub']


def subject_matches(access_token: str, refresh_token: str, subject) -> bool:
    """ Checks that the access_token and refresh_token have the same subject (from same user)"""
    try:
        if get_jwt_subject(access_token) == get_jwt_subject(refresh_token):
            return True

        return False

    except JWTClaimsError:
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
    # todo: check if refresh token and access token belong to the same user

    if access_token_not_expired(access_token=token):
        # Access valid
        if 'refresh_token' in request.headers.keys():
            refresh_token: str = request.headers['refresh_token']
            if access_token_not_expired(refresh_token) and subject_matches(token, refresh_token, get_jwt_subject(token)):
                # Refresh token is valid. Refresh the token.
                token = refresh_access_token(token, refresh_token)

        return token

    else:
        # Access invalid
        if 'refresh_token' in request.headers.keys():
            refresh_token = request.headers['refresh_token']

            if access_token_not_expired(refresh_token) and subject_matches(token, refresh_token, get_jwt_subject(refresh_token)):
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
            'sub': jose.jwt.decode(refresh_token, os.environ['SECRET_KEY'], subject=get_jwt_subject(refresh_token))['sub']
        }, expires_delta=timedelta(days=1))

        return access_token

    # Refresh token is expired, return expired access token
    else:
        return access_token


def delete_emails(email_ids: List[int]) -> None:
    with Session(engine) as session:
        for email_id in email_ids:
            db_email = session.query(Emails).filter(Emails.id == email_id).scalar()
            session.delete(db_email)

        session.commit()


def save_emails(user_uuid: str, emails: List[API_EMAIL], backup: bool = False):
    """ Save email(s) to a User """
    with Session(engine) as session:
        user = session.query(Users).filter(Users.uuid == user_uuid).scalar()

        if user:
            for email in emails:
                # Check if an email already exists in the db
                if session.query(Emails).filter(Emails.id == email.id).scalar():
                    pass

                else:
                    db_email = Emails(id=email.id, subject=email.subject, sender=email.sender, body=email.body,
                                      retrieved=False, folder=email.folder, backup=backup)
                    session.add(db_email)
                    user.emails.append(db_email)
                    session.commit()

        else:
            raise HTTPException(status_code=400, detail="No user exists with provided uuid")


def user_exists(user_uuid: str) -> bool:
    with Session(engine) as session:
        if session.query(Users).filter(Users.uuid == user_uuid).scalar():
            return True

        return False
