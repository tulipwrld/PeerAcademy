from typing import Annotated
import urllib.parse
import aiohttp
from fastapi import Body, HTTPException, Response
import jwt

# from login import UserLoginSchema, cfg, Security
# from database import *
from config import config

def generate_google_uri():
    params={
        "client_id": config.oAUTH_Google_ClientID, #clientid
        "redirect_uri": f"{config.WEBAPP_URL}/auth/google", #redirect_url: frontend_url/webpage
        "response_type": "code",
        "scope": " ".join([
            "https://www.googleapis.com/auth/cloud-platform",
            "openid",
            "profile",
            "email",
        ]),
        "access_type": "offline",
        # "state": None
    }

    query = urllib.parse.urlencode(params, quote_via=urllib.parse.quote)
    google_url = "https://accounts.google.com/o/oauth2/v2/auth"
    return f"{google_url}?{query}"



async def get_data(code: Annotated[str, Body(..., embed=True)]):#, state: Annotated[str, Body()]):
    try:
        token_url = "https://oauth2.googleapis.com/token"
        # await get_data(token_url, code)
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url=token_url,
                data={
                    "client_id": config.oAUTH_Google_ClientID, 
                    "client_secret": config.oAUTH_Google_Secret.get_secret_value(),
                    "grant_type": "authorization_code",
                    "redirect_uri": f"{config.WEBAPP_URL}/auth/google",#"http://localhost:5173/auth/google",
                    "code": code,
                },
                ssl=False, # for Test on localhost
            ) as response:
                res = await response.json()
                # print(f"{res=}")
                id_token=res["id_token"]
                user_data = jwt.decode(
                    id_token,
                    algorithms=["RS256"],
                    options={"verify_signature": False}
                )

        return{
            "email": user_data["email"],
            "picture": user_data["picture"],
            "name": user_data["name"]
        }
    except Exception as e:
        print(f"[INFO] ERROR {e}")