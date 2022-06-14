import os
import time
from aiosmtpd.controller import Controller


class ExampleHandler:
    async def handle_RCPT(self, server, session, envelope, address, rcpt_options):
        if not address.endswith(f'@{os.environ.get("DOMAIN")}.{os.environ.get("TLD")}'):
            return '550 not relaying to that domain'
        envelope.rcpt_tos.append(address)
        return '250 OK'

    async def handle_DATA(self, server, session, envelope):
        print('Message from %s' % envelope.mail_from)
        print('Message for %s' % envelope.rcpt_tos)
        print(f'Content: {envelope.content}')
        print('Message data:\n')
        for ln in envelope.content.decode('utf8', errors='replace').splitlines():
            print(f'> {ln}'.strip())
        print()
        print('End of message')
        return '250 Message accepted for delivery'


controller = Controller(ExampleHandler(), hostname=os.environ.get('SMTP_HOST'), port=int(os.environ.get('SMTP_PORT')))

if __name__ == '__main__':
    controller.start()

    # While loop to keep thread running (and thus SMTP server running)
    while True:
        pass
