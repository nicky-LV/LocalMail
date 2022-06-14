from pydantic import BaseModel, validator, ValidationError
from typing import Optional, Type


class PydanticUser(BaseModel):
    class Config:
        orm_mode = True

    id: int
    first_name: str
    surname: str

    # Any type for relationship
    emails: Type


class PydanticEmail(BaseModel):
    class Config:
        orm_mode = True

    id: int
    subject: str
    sender: str
    recipients: str
    message: str

    # Any type for relationship
    users: Type

    @validator('subject')
    def check_subject_length(cls, v):
        if len(v) > 70:
            return ValidationError

        return v

    @validator('sender')
    def check_sender_length(cls, v):
        if len(v) > 320:
            return ValidationError

        return v