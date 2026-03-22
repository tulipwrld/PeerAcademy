from authx import AuthX, AuthXConfig
from pydantic import BaseModel

cfg = AuthXConfig()
cfg.JWT_SECRET_KEY = "SECRET_KEY"
cfg.JWT_ACCESS_COOKIE_NAME = "access_token"
cfg.JWT_TOKEN_LOCATION = ["cookies"]

Security = AuthX(config=cfg)


class UserLoginSchema(BaseModel):
    email: str