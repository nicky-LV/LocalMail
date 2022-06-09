import smtplib
from email.message import EmailMessage
from smtplib import SMTPException
import os
import pytest

from .main import controller


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


def test_sending_email(smtp):
    """ Test sending an email to SMTP smtp_server """
    email_msg = EmailMessage()
    email_msg['To'] = f'example_to@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    email_msg['From'] = f'example_from@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    smtp.send_message(email_msg)
