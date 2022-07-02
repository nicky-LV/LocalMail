from passlib.hash import sha256_crypt
from ..utils import verify_password


def test_password_hashing():
    password = "secret_test_password"
    hashed_password = sha256_crypt.hash(password)
    assert verify_password(password=password, hashed_password=hashed_password) is True
    wrong_password = "wrong_test_password"
    assert verify_password(password=wrong_password, hashed_password=hashed_password) is False
