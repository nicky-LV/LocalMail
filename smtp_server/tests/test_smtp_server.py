import os
import pytest
import smtplib
from smtplib import SMTPException
from email.message import EmailMessage
from ..main import controller
from ..pydantic_models import *
from ..utils import *


@pytest.fixture
def smtp():
    try:
        engine = smtplib.SMTP(host=controller.hostname, port=controller.port)
        return engine

    except SMTPException as e:
        raise e


def test_smtp_connection(smtp):
    """ Test SMTP connection """
    assert smtp.noop() == (250, b'OK')


def test_sending_email_no_subject(smtp):
    """ Test sending an email to SMTP server - without a subject """
    email_msg = EmailMessage()
    email_msg['To'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    email_msg['From'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    smtp.send_message(email_msg)


def test_sending_email_w_subject(smtp):
    """ Test sending an email to SMTP server - with a subject """
    email = EmailMessage()
    email['To'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    email['From'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    subject = 'Test subject'

    email['Subject'] = subject

    assert get_subject_from_email(email_to_string(email)) == subject
    response = smtp.send_message(email)

    # A response of {} indicates the SMTP server responded with '250 OK' (success).
    assert response == {}

