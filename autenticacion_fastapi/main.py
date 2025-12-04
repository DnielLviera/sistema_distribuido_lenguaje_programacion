from fastapi import FastAPI
from routers.userRoutes import router as user_router
from config.database import init_db
from contextlib import asynccontextmanager
# import jwt

# print(jwt.api_jwt.generate_key())

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Para iniciar la app
    await init_db()
    yield
   # 
app = FastAPI(title="Auth API", lifespan=lifespan)

app.include_router(user_router)
