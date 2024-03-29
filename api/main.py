import jose.jwt
from fastapi import FastAPI, HTTPException, Response, Depends, Request, BackgroundTasks
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic_models import *
from db import Users, Emails, UserEmails, engine
from utils import *
from sqlalchemy import and_
from jose.jwt import decode
from jose.exceptions import JWTClaimsError
import uuid

# todo: update requirements.txt with ONLY the dependencies that this service needs.
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'OPTIONS'],
    allow_headers=['*'],
)


@app.get(path='/')
def index(response: Response):
    return Response(status_code=200)


@app.post(path='/signup')
def signup(response: Response, user: User):
    """ Receives userdata via JSON.
     Responses:
     200 - JWT token in response
     400 - Invalid email (email already exists)
    """

    # SignUpUser validates that the email address is unique.
    with Session(engine) as session:
        try:
            # Create user and return JWT token
            user_uuid: str = generate_uuid()
            db_user: Users = Users(uuid=user_uuid, email_address=user.email_address,
                                   password=hash_password(user.password),
                                   disabled=False)
            session.add(db_user)
            session.commit()

            # return JWT token
            access_token: str = create_access_token(data={
                'sub': db_user.uuid
            }, expires_delta=timedelta(days=1))

            # refresh token
            refresh_token: str = create_access_token(data={
                'sub': db_user.uuid
            }, expires_delta=timedelta(days=7))

            # Set-Cookie header in response
            response.set_cookie(key='access_token', value=access_token)
            response.set_cookie(key='refresh_token', value=refresh_token)
            return {
                'uuid': db_user.uuid,
                'access_token': access_token,
                'refresh_token': refresh_token
            }

        except Exception as e:
            print(e)
            raise HTTPException(status_code=400)


@app.post('/login')
def login(user: LogInUser, response: Response):
    """
    LogInUser validates that the user exists and the password is correct.
    :param user - requires "email_address" and "password" in the request body (JSON).
    :param response: Response obj
    """

    # Query user
    with Session(engine) as session:
        db_user = session.query(Users).filter(Users.email_address == user.email_address).scalar()

        if db_user:
            access_token: str = create_access_token(data={
                'sub': db_user.uuid
            }, expires_delta=timedelta(days=1))

            # refresh token
            refresh_token: str = create_access_token(data={
                'sub': db_user.uuid
            }, expires_delta=timedelta(days=7))

            # Set-Cookie header in response
            response.set_cookie(key='access_token', value=access_token)
            response.set_cookie(key='refresh_token', value=refresh_token)

            return {
                'uuid': db_user.uuid,
                'access_token': access_token,
                'refresh_token': refresh_token
            }

        else:
            return Response(status_code=400, content="Email or password is invalid")


@app.get('/getEmails/{user_id}')
def get_emails(user_id: str, background_tasks: BackgroundTasks, token: str = Depends(access_token), backup: bool = False):
    try:
        decoded_access_token = decode(token=token, key=os.environ['SECRET_KEY'], subject=user_id)
        if user_id == decoded_access_token['sub']:
            # Retrieve user's emails
            with Session(engine) as session:
                # retrieve emails linked to users account, filter by backup attribute
                user = session.query(Users).filter(Users.uuid == user_id).scalar()
                emails = session.query(Emails).filter(Users.uuid == user_id, Emails.backup == backup)

                # todo: will this task run if a non-200 response is returned?
                background_tasks.add_task(delete_emails, [email.id for email in emails])

                return {
                    'name': f'{user.firstname} {user.surname}',
                    'email_address': user.email_address,
                    'data': [API_EMAIL(
                        id=db_email.id,
                        subject=db_email.subject,
                        body=db_email.body,
                        sender=db_email.sender,
                        recipients=[user.email_address for user in db_email.recipients],
                        datetime=db_email.datetime.utcnow().isoformat() + 'Z',
                        folder=db_email.folder,
                        backup=db_email.backup
                    ).dict()
                    for db_email in emails]
                }

        else:
            return Response(status_code=400, content=f'User does not match token sub')

    except Exception as e:
        return Response(status_code=400, content=str(e))


@app.post('/saveEmail')
def save_email(email: Email):
    """ API endpoint to save email(s) from SMTP Server container """
    db_email = Emails(subject=email.subject, body=email.body, sender=email.sender)
    num_recipients = 0

    # Check for recipients that are users and add them to the email
    with Session(engine) as session:
        for recipient in email.recipients:
            db_user = session.query(Users).filter(Users.email_address == recipient).scalar()

            if db_user:
                db_email.recipients.append(db_user)
                num_recipients += 1

        # Save email if sent to any valid users.
        if num_recipients > 0:
            session.add(db_email)
            session.commit()

    return Response(status_code=200)


@app.post('/backup/{user_id}')
def backup_emails(user_id: str, emails: List[API_EMAIL], token: str = Depends(access_token)):
    try:
        decoded_access_token = decode(token=token, key=os.environ['SECRET_KEY'], subject=user_id)

        # user_id matches the token subject
        if user_id == decoded_access_token['sub']:
            if user_exists(user_id):
                # Save emails to user's account
                save_emails(user_uuid=user_id, emails=emails, backup=True)
                return Response(status_code=200)

            else:
                raise HTTPException(status_code=400, detail='User does not exist')

    except JWTClaimsError:
        raise HTTPException(status_code=400, detail='Mismatching uuids')

    except Exception:
        raise HTTPException(status_code=500)
