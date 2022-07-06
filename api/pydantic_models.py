import re
import os
from pydantic import BaseModel, validator
from passlib.hash import sha256_crypt
from fastapi import HTTPException
from typing import List
from sqlalchemy.orm import Session
from db import engine, Users
from utils import verify_password


class User(BaseModel):
    email_address: str
    password: str

    @validator('email_address')
    def email_regex_test(cls, v):
        if re.match(fr"(\w+@{os.environ['DOMAIN']}.{os.environ['TLD']})", v):
            return v

        else:
            raise HTTPException(status_code=400, detail={
                'field': 'email',
                'message': 'Email is invalid.'
            })


class SignUpUser(User):
    """
    Class that ensures:
    - User's email is available
    """
    @validator('email_address')
    def email_availability_validator(cls, v):
        """ Checks that the user's email is not taken already """
        with Session(engine) as session:
            if session.query(Users).filter(Users.email_address == v).scalar() is None:
                return v

            else:
                raise HTTPException(status_code=400, detail={
                    'field': 'email',
                    'message': 'Email is taken.'
                })


class LogInUser(User):
    """
    Class that ensures:
    - User's email matches an account
    - User's password is correct
    """

    @validator('email_address')
    def user_exists(cls, v):
        """ Checks that user exists with the email address """
        with Session(engine) as session:
            if session.query(Users).filter(Users.email_address == v).scalar() is not None:
                return v

            else:
                raise HTTPException(status_code=400, detail={
                    'field': 'email',
                    'message': 'No user exists with given email address.'
                })

    @validator('password')
    def check_password(cls, v, values):
        with Session(engine) as session:
            u: Users = session.query(Users).filter(Users.email_address == values['email_address']).scalar()

            if u is not None:
                if verify_password(password=v, hashed_password=u.password):
                    return v

                else:
                    raise HTTPException(status_code=400, detail={
                        'field': 'password',
                        'message': 'Password is incorrect.'
                    })

            else:
                raise HTTPException(status_code=400, detail={
                    'field': 'password',
                    'message': 'Email or password is incorrect.'
                })


class Email(BaseModel):
    id: int | None
    subject: str | None
    body: str | None
    recipients: List[str]
    sender: str
    datetime: str | None

    class Config:
        orm_mode = True

