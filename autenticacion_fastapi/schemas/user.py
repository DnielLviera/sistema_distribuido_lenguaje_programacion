from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    rol: str

# class UserOut(BaseModel):
#     id: int
#     email: EmailStr
#     is_active: bool
#     is_verified: bool

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyCode(BaseModel):
    email: EmailStr
    code: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

    class Config:
        orm_mode = True
