from aiosmtpd.controller import Controller
from sqlalchemy.exc import MultipleResultsFound
from utils import get_subject_from_email, get_body_from_email
import os
import requests


class ExampleHandler:
    def __init__(self):
        self.sender = None
        super().__init__()

    async def handle_RCPT(self, server, session, envelope, address, rcpt_options):
        if not address.endswith(f'@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'):
            return '550 not relaying to that domain'

        envelope.rcpt_tos.append(address)
        self.sender = address
        return '250 OK'

    async def handle_DATA(self, server, session_, envelope):
        subject = get_subject_from_email(envelope.content.decode('utf8'))
        body = get_body_from_email(envelope.content.decode('utf8'))
        recipients = envelope.rcpt_tos

        response = requests.post(url=f'http://api:8000/saveEmail', json={
            'subject': subject,
            'body': body,
            'recipients': recipients,
            'sender': self.sender
        }, headers={
            'Content-Type': 'application/json'
        })

        assert response.status_code == 200
        return '250 Message accepted for delivery'


controller = Controller(ExampleHandler(), hostname=os.environ.get('SMTP_HOST'), port=int(os.environ.get('SMTP_PORT')))

if __name__ == '__main__':
    controller.start()

    # While loop to keep thread running (and thus SMTP server running)
    while True:
        pass
