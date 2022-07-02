from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic_models import *
from db import Users, Emails, UserEmails, engine
from utils import *
from sqlalchemy import and_

# todo: update requirements.txt with ONLY the dependencies that this service needs.
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.post(path='/signup')
def signup(response: Response, user: SignUpUser):
    """ Receives userdata via JSON.
     Responses:
     200 - JWT token in response
     400 - Invalid email (email already exists)
    """

    # Check if user with email already exists
    with Session(engine) as session:
        if session.query(Users).filter(Users.email_address == user.email_address).scalar():
            raise HTTPException(status_code=400, detail=f"User with email address {user.email_address} already exists.")

        # Create user and return JWT token
        else:
            user_uuid: str = generate_uuid()
            db_user: Users = Users(uuid=user_uuid, email_address=user.email_address,
                                   password=hash_password(user.password),
                                   disabled=False)
            session.add(db_user)
            session.commit()

            # return JWT token
            jwt_token: str = create_access_token(data={
                'sub': db_user.uuid.hex
            }, expires_delta=timedelta(days=1))

            # refresh token
            refresh_token: str = create_access_token(data={
                'sub': db_user.uuid.hex
            }, expires_delta=timedelta(days=7))

            # Set-Cookie header in response
            response.set_cookie(key='access_token', value=jwt_token)
            response.set_cookie(key='refresh_token', value=refresh_token)
            return {
                'uuid': db_user.uuid.hex,
                'access_token': jwt_token,
                'refresh_token': refresh_token
            }


@app.post('/login')
def login(user: SignUpUser):
    """
    :param user - requires "email_address" and "password" in the request body (JSON).
    """

    # Query user
    with Session(engine) as session:
        db_user: Users = session.query(Users).filter(Users.email_address == user.email_address).scalar()

        if db_user:
            # Check passwords match
            if verify_password(user.password, db_user.password):
                # Generates access token and refresh token
                jwt_token: str = create_access_token(data={
                    'sub': db_user.uuid.hex
                }, expires_delta=timedelta(days=1))

                # refresh token
                refresh_token: str = create_access_token(data={
                    'sub': db_user.uuid.hex
                }, expires_delta=timedelta(days=7))

                return {
                    'uuid': db_user.uuid.hex,
                    'access_token': jwt_token,
                    'refresh_token': refresh_token
                }

            else:
                return Response(status_code=400, content="Email or password is invalid")

        else:
            return Response(status_code=400, content="Email or password is invalid")

