import time

verification_codes = {}

def save_code(email: str, code: str):
    verification_codes[email] = {
        "code": code,
        "exp": time.time() + 300  # 5 min
    }

def check_code(email: str, code: str) -> bool:
    if email not in verification_codes:
        return False

    data = verification_codes[email]

    # expirado
    if time.time() > data["exp"]:
        del verification_codes[email]
        return False

    # correcto
    if data["code"] == code:
        del verification_codes[email]
        return True

    return False
