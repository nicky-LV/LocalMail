import os
import pytest
from smtplib import SMTP, SMTPException
from email.message import EmailMessage
from ..main import controller
from ..utils import *


@pytest.fixture
def smtp():
    try:
        engine = SMTP(host=os.environ["MAIL_PROXY"], port=int(os.environ['MAIL_PORT']))
        return engine

    except SMTPException as e:
        raise e


def test_smtp_connection(smtp):
    """ Test SMTP connection """
    assert smtp.noop() == (250, b'OK')


def test_email_plain(smtp):
    """ Send a plain email """
    email_msg = EmailMessage()
    email_msg['To'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    email_msg['From'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    smtp.send_message(email_msg)


def test_mail_subject(smtp):
    """ Send email with subject """
    email = EmailMessage()
    email['To'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    email['From'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    subject = 'Test subject'

    email['Subject'] = subject

    assert get_subject_from_email(email_to_string(email)) == subject
    response = smtp.send_message(email)

    # A response of {} indicates the SMTP server responded with '250 OK' (success).
    assert response == {}


def test_mail_body(smtp):
    """ Send email with subject and body """
    email = EmailMessage()
    email['To'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    email['From'] = f'test@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'
    email['Subject'] = 'Email with body'
    # Set body
    email.set_content(f"This is the body of the email. MIME-type of email: {email.get_content_type()}")

    assert get_body_from_email(email.as_string()) == f"This is the body of the email. MIME-type of email: {email.get_content_type()}"
    response = smtp.send_message(email)
    assert response == {}


def test_email_forwarding(smtp):
    """ Send email to nginx mail proxy """
    email = EmailMessage()
    email['To'] = 'test@test.com'
    email['From'] = 'test@test.com'
    email['Subject'] = 'test_email_forwarding'
    # Set body
    email.set_content(f"This is the body of the email. MIME-type of email: {email.get_content_type()}")
    smtp.send_message(email)


def test_email_html(smtp):
    """ Send email with HTML body """
    email = EmailMessage()
    email['To'] = 'test@test.com'
    email['From'] = 'test@test.com'
    email['Subject'] = 'HTML email'
    # Set HTML body
    email.set_content(f"""
    <div>
    <h1>Test</h1>
    <p style="color:red;">Test</p>
    <script>alert('XSS vulnerability')</script>
    <p>MIME-type: {email.get_content_type()}</p>
    </div>
    """)
    smtp.send_message(email)
