import smtplib
from email.message import EmailMessage
from smtplib import SMTPException
import os
import pytest


@pytest.fixture
def smtp():
    try:
        engine = smtplib.SMTP(host=str(os.environ.get("SMTP_HOST")), port=int(os.environ.get("SMTP_PORT")))
        return engine

    except SMTPException as e:
        raise e


def test_smtp_connection(smtp):
    """ Test SMTP connection """
    assert smtp.noop() == (250, b'OK')


def test_sending_email(smtp):
    """ Test sending an email to SMTP server """
    email_msg = EmailMessage()
    email_msg['To'] = f'example_to@{os.environ.get("SMTP_HOST")}:{os.environ.get("SMTP_PORT")}'
    email_msg['From'] = f'example_from@{os.environ.get("SMTP_HOST")}:{os.environ.get("SMTP_PORT")}'
    smtp.send_message(email_msg)
