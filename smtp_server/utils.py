from email.message import EmailMessage


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


def get_body_from_email(email_content: str) -> str:
    assert type(email_content) == str

    body_found = False
    body = ''

    for line in email_content.splitlines():
        if not body_found and line == '':
            body_found = True

        elif body_found:
            body += f"{line}\n"

    return body.strip('\n')


def email_to_string(email: EmailMessage):
    """ ONLY FOR EmailMessage INSTANCES. Returns content of email as utf8 string. """
    assert isinstance(email, EmailMessage)
    return str(email.as_bytes().decode('utf8'))

