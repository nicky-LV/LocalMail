import uuid
from email.message import EmailMessage
from db import *


def generate_uuid():
    return uuid.uuid4()


def get_subject_from_email(email_content: str):
    assert type(email_content) == str
    # Iterates through the lines searching for the "Subject" header
    for line in email_content.splitlines():
        line = line.strip()

        # Body header appeared before subject header. There is no subject, break.
        if line.startswith("Body:"):
            break

        # Check for Subject header.
        elif line.startswith("Subject:"):
            return "".join(line.split("Subject: ")[1::])

    # Some emails may not have the Subject header.
    return None


def get_body_from_email(email_content: str):
    assert type(email_content) == str

    body_found = False
    body = ""
    for line in email_content.splitlines():
        line = line.strip()

        if body_found:
            body += f"{line}\n"

        else:
            if line == "\n":
                body_found = True

    if body == "":
        return None

    else:
        return body


def email_to_string(email: EmailMessage):
    """ ONLY FOR EmailMessage INSTANCES. Returns content of email as utf8 string. """
    assert isinstance(email, EmailMessage)
    return str(email.as_bytes().decode('utf8'))


def wipe_test_users():
    """ Removes all users with an email_address prefixed with "test" """
    for user in session.query(Users).all():
        if user.email_address.startswith("test"):
            session.delete(user)
    session.commit()

