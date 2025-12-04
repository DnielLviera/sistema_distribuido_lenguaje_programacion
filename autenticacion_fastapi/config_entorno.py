from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SMTP_EMAIL: str
    APP_PASSWORD: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()