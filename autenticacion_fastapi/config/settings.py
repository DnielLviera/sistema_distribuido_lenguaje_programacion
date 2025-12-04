from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_user: str
    database_password: str
    database_host: str
    database_port: int
    database_name: str

    @property
    def database_url(self):
        return (
            f"postgresql+asyncpg://{self.database_user}:"
            f"{self.database_password}@{self.database_host}:"
            f"{self.database_port}/{self.database_name}"
        )

    model_config = {
        "env_file": ".env.database",
        "env_prefix": "",
        "extra": "ignore", 
    }

settings = Settings()
