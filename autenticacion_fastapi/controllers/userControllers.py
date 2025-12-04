from sqlalchemy.ext.asyncio import AsyncSession
import bcrypt
from sqlalchemy import select
import random
from models.user import User
from schemas.user import UserCreate, VerifyCode
from service.email_service import send_verification_email
from service.verificacion_store import save_code, check_code
from service.pending_users import save_pending_user, get_pending_user, delete_pending_user


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


async def send_verification(payload: UserCreate, db: AsyncSession):
    # Verificar si ya existe un usuario con ese correo
    query = select(User).where(User.correo == payload.email)
    result = await db.execute(query)
    existing = result.scalars().first()

    if existing:
        return {"error": "El correo ya está registrado"}

    # Generar código aleatorio de 4 dígitos
    code = str(random.randint(1000, 9999))
    print(code)

    # Guardar datos del usuario temporalmente
    save_pending_user(payload.email, payload)

    # Guardar los datos temporalmente
    save_code(payload.email, code)

    print("EMAIL RECIBIDO EN payload.email:", payload.email)


    # Enviar el correo
    send_verification_email(payload.email, code)

    return {"message": "Código enviado al correo"}



async def verify_and_create(data: VerifyCode, db: AsyncSession):
    # Verificar el código enviado
    if not check_code(data.email, data.code):
        return {"error": "Código incorrecto o expirado"}

    # Recuperar datos del usuario antes del registro
    user_data = get_pending_user(data.email)

    if not user_data:
        return {"error": "No existe un registro pendiente para este correo"}

    # Hashear contraseña
    hashed = hash_password(user_data.password)

    # Crear usuario
    new_user = User(
        nombre=user_data.nombre,
        correo=user_data.email,
        password_hash=hashed,
        rol=user_data.rol
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Eliminar datos temporales
    delete_pending_user(data.email)

    return "Usuario registrado correctamente"
