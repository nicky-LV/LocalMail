from aiosmtpd.controller import Controller
from sqlalchemy.exc import MultipleResultsFound
from db import *
from utils import get_subject_from_email, get_body_from_email
import os


# todo: update requirements.txt with ONLY the dependencies that this service needs.
class ExampleHandler:
    async def handle_RCPT(self, server, session, envelope, address, rcpt_options):
        if not address.endswith(f'@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'):
            return '550 not relaying to that domain'

        envelope.rcpt_tos.append(address)
        return '250 OK'

    async def handle_DATA(self, server, session_, envelope):
        # Check which recipients actually exist.
        existing_recipients = []

        # Extract subject from email
        assert type(envelope.content) == bytes
        subject = get_subject_from_email(envelope.content.decode('utf8'))
        body = get_body_from_email(envelope.content.decode('utf8'))

        # todo: save email for any valid recipients

        return '250 Message accepted for delivery'


controller = Controller(ExampleHandler(), hostname=os.environ.get('SMTP_HOST'), port=int(os.environ.get('SMTP_PORT')))

if __name__ == '__main__':
    controller.start()

    # While loop to keep thread running (and thus SMTP server running)
    while True:
        pass
