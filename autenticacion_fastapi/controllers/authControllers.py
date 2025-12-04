from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User
from schemas.user import UserLogin, TokenOut
from utils.jwt_utils import create_access_token
from controllers.userControllers import verify_password
from fastapi import HTTPException, status

async def login_user(payload: UserLogin, db: AsyncSession) -> TokenOut:
    # buscar usuario por correo
    query = select(User).where(User.correo == payload.email)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
        )

    # crear token
    token_data = {"email": user.correo, "password": user.password_hash}
    access_token = create_access_token(token_data)
    return TokenOut(access_token=access_token)
