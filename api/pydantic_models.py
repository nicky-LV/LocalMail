import re
import os
from pydantic import BaseModel, validator
from passlib.hash import sha256_crypt
from fastapi import HTTPException
from typing import List


class SignUpUser(BaseModel):
    email_address: str
    password: str

    @validator('email_address')
    def email_regex_test(cls, v):
        if re.match(fr"(\w+@{os.environ['DOMAIN']}.{os.environ['TLD']})", v):
            return v

        else:
            raise HTTPException(status_code=400, detail="Email failed regex test")


class Email(BaseModel):
    id: int | None
    subject: str | None
    body: str | None
    recipients: List[str]
    sender: str
    datetime: str

    class Config:
        orm_mode = True

