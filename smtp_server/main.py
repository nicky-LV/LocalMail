from aiosmtpd.controller import Controller
from sqlalchemy.exc import MultipleResultsFound
from db import *
from utils import get_subject_from_email, get_body_from_email


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

        email: Emails = Emails(sender=envelope.mail_from, body=body,
                               subject=subject, retrieved=False)

        for rcpt_address in envelope.rcpt_tos:
            try:
                recipient = session.query(Users).filter(Users.email_address == str(rcpt_address)).scalar()

                if recipient and recipient not in existing_recipients:
                    existing_recipients.append(recipient)
                    email.users.append(recipient)

            except MultipleResultsFound:
                # Multiple users exist with the same email. Remove users with duplicate emails.
                pass

        # If recipients exist, save the email. It will be linked to the recipients' accounts.
        if existing_recipients:
            session.add(email)
            session.commit()

            return '250 Message accepted for delivery'

        # No valid recipients exist, so accept the message but do nothing with it.
        else:
            return '250 Message accepted for delivery'


controller = Controller(ExampleHandler(), hostname=os.environ.get('SMTP_HOST'), port=int(os.environ.get('SMTP_PORT')))

if __name__ == '__main__':
    controller.start()

    # While loop to keep thread running (and thus SMTP server running)
    while True:
        pass
