from os.path import join, dirname
from pathlib import Path
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

from fastapi import FastAPI
# from typing import AsyncGenerator

ROOT_DIR = Path(__file__).parent.parent

class Config(BaseSettings):
    API_KEY_AI: SecretStr

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