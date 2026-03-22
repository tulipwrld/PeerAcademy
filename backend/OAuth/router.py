import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from typing import Annotated

from fastapi import APIRouter, Body, HTTPException, Response, security, Request
from fastapi.responses import JSONResponse, RedirectResponse

import jwt

# from oauth import generate_google_uri, get_data
# from login import UserLoginSchema, cfg, Security

from DB import *
from config import config

from .login import UserLoginSchema, cfg, Security
from .oauth import generate_google_uri, get_data


auth_router = APIRouter(prefix="/api/auth")

@auth_router.get("/google/url")
async def ret_url():
    uri = generate_google_uri()
    return RedirectResponse(url=uri, status_code=302)


@auth_router.post("/google/callback")
async def handle_code(code: Annotated[str, Body(..., embed=True)], response: Response):#, state: Annotated[str, Body()]): , request: Request
    if code != None:
        try:
            data = await get_data(code)
            # print(data["email"], data["picture"], data["name"])
            
            await add_user(data["email"], data["name"], data["picture"])

            # user_id = await get_id(data["email"])

            user_id = await get_id(data["email"])

            if not user_id:
                raise HTTPException(status_code=401, detail="User not found")
            token = Security.create_access_token(uid=f"{user_id}") #user_id="52", email="example@example.com", picture="url"
            response.set_cookie(cfg.JWT_ACCESS_COOKIE_NAME, token)
        except Exception as e:
            print(f"[INFO] ERROR {e}")
            return HTTPException(status_code=401, detail="ERROR")
    else:
        return HTTPException(status_code=401, detail="ERROR")




@auth_router.post("/login")
async def auth(userdata: UserLoginSchema, response: Response):#, request: Request
    try:
        # data = await request.json()

        user_id = await get_id(userdata.email)#db.
        print(user_id)
        if not user_id:
            raise HTTPException(status_code=401, detail="User not found")
        token = Security.create_access_token(uid=f"{user_id}") #user_id="52", email="example@example.com", picture="url"
        response.set_cookie(cfg.JWT_ACCESS_COOKIE_NAME, token)

        # print(data)
        # return {"access_token": token}
        return RedirectResponse(url=f"{config.WEBAPP_URL}/profile", status_code=302)#/me
    except Exception as e:
        print(f"{e}")
        raise HTTPException(status_code=401, detail="Incorrect Data")



@auth_router.get("/check/profile")
async def auth_p(request: Request):#token: str,
    try:
        token = request.cookies.get(cfg.JWT_ACCESS_COOKIE_NAME)
        if not token:
            # raise HTTPException(status_code=401, detail="Authentication Error")
            return RedirectResponse(url=f"{config.WEBAPP_URL}/login", status_code=401)

        payload=jwt.decode(
            token,
            cfg.JWT_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        data = await get_user(int(payload["sub"]))# db.get_user(int(payload["sub"]))

        return JSONResponse(
            status_code=200,
            content={
                "name": data[2],#["name"],
                "picture": data[4],#["picture"], 
                "email": data[1],#["email"],
                "description": data[3],#"Мое описание шикарно:)",#["grade"],
                "statements": data[5],#["interviews"]
                "videos": data[6],#["interviews"]
                })

    except Exception as e:
        print(f"{e}")
        return RedirectResponse(url=f"{config.WEBAPP_URL}/login", status_code=401)
        # raise HTTPException(status_code=402, detail="Incorrect Data")


@auth_router.put('/update')
async def edit_name(request: Request):
    data = await request.json()
    name = data.get("name", 'Incognito')
    description = data.get("description", '-')
    # resume = list(data.get("resume", []))

    token = request.cookies.get(cfg.JWT_ACCESS_COOKIE_NAME)
    if not token:
        # raise HTTPException(status_code=401, detail="Authentication Error")
        return RedirectResponse(url=f"{config.WEBAPP_URL}/login", status_code=401)
    try:
        payload=jwt.decode(
            token,
            cfg.JWT_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        data1 = await get_user(int(payload["sub"]))
        # res = await get_user(int(payload["sub"]))
        res = await update_user_data(int(payload["sub"]), name, description)#, resume)
        return JSONResponse(status_code=200, content=(res, f"{data1}"))
    except Exception as e:
        return JSONResponse(status_code=401, content=f"ERROR: {e}")