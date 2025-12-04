from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from config.database import get_db
from controllers.userControllers import send_verification, verify_and_create
from schemas.user import UserCreate, UserLogin, TokenOut, VerifyCode
from controllers.authControllers import login_user

router = APIRouter(prefix="/users", tags=["Users"])

# Registro de usuario
@router.post("/registro")
async def register_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    response = await send_verification(payload, db)

    if "error" in response:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=response["error"]
        )

    return response


# Verificar el correo
@router.post("/verify")
async def verify_code(data: VerifyCode, db: AsyncSession = Depends(get_db)):
    response = await verify_and_create(data, db)

    if "error" in response:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=response["error"]
        )

    return response


# Loguearse
@router.post("/login", response_model=TokenOut)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    return await login_user(payload, db)
