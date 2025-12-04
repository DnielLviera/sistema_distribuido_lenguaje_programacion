from schemas.user import UserCreate

pending_users = {}  
# ejemplo: { "correo@mail.com": UserCreate(...) }


def save_pending_user(email: str, payload: UserCreate):
    pending_users[email] = payload


def get_pending_user(email: str):
    return pending_users.get(email)


def delete_pending_user(email: str):
    if email in pending_users:
        del pending_users[email]
