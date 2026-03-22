from os.path import join, dirname
from pathlib import Path
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

from fastapi import FastAPI
# from typing import AsyncGenerator

ROOT_DIR = Path(__file__).parent.parent

class Config(BaseSettings):
    oAUTH_Google_Secret: SecretStr
    oAUTH_Google_ClientID: str
    API_KEY: SecretStr

    WEBAPP_URL: str = "http://localhost:3000" #  https://frontend_url
    WEBHOOK_URL: str = "http://localhost:8000" # https://backend_url

    token_url: str = "https://oauth2.googleapis.com/token"

    APP_HOST: str = "localhost"
    APP_PORT: int = 8000 #3080

    user: SecretStr
    password: SecretStr
    db_name: str
    host: str = "localhost"
    port: int = 5432

    # DATABASE_URL: str = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

config = Config()

# async def lifespan(app: FastAPI) -> AsyncGenerator:
#     await bot.set_webhook(
#         url=f"{config.WEBHOOK_URL}/webhook",
#         allowed_updates=dp.resolve_used_update_types(),
#         drop_pending_updates=True
#     )
    


app=FastAPI() #lifespan=lifespan