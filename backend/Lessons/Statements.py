# from fastapi import APIRouter, Request, UploadFile, Form, File
# from fastapi.responses import JSONResponse, RedirectResponse

# import jwt

# from DB import *
# from config import config

# from .downloader import download_photo
# from .S3 import s3_client
# from backend.OAuth.login import UserLoginSchema, cfg, Security
# # from backend.OAuth.oauth import generate_google_uri, get_data

# post_router = APIRouter(prefix="/api/statements")

# @post_router.post("/post")
# async def auth_p(request: Request, images: list[UploadFile] = File(default=[]), statement: str = Form(...), name: str = Form(...), tags: list = [Form(...)],):#token: str,
#     try:
#         token = request.cookies.get(cfg.JWT_ACCESS_COOKIE_NAME)
#         # print(f"{bool(token)}")

#         if not token:
#             # raise HTTPException(status_code=401, detail="Authentication Error")
#             return RedirectResponse(url=f"{config.WEBAPP_URL}/login", status_code=401)

#         payload=jwt.decode(
#             token,
#             cfg.JWT_SECRET_KEY,
#             algorithms=["HS256"],
#             options={"verify_exp": True}
#         )
#         # data = await get_user(int(payload["sub"]))# db.get_user(int(payload["sub"]))

#         # print(f'{statement}, {images}')
#         s = []
#         res = await download_photo(int(payload["sub"]), images)
#         for i in range(len(res)):
#             photos = await s3_client.upload_file(res[i])
#             s.append(f'https://s3.ru-7.storage.selcloud.ru/{res[i]}')

#         id_state = await add_state(name, statement, int(payload["sub"]), tags, s)
#         await add_user_statement(int(payload["sub"]), id_state)
#         return JSONResponse(
#             status_code=200,
#             content={
#                 "status": "success"
#                 })

#     except Exception as e:
#         print(f"{e}")
#         return JSONResponse(
#             status_code=400,
#             content={
#                 "status": "wrong"
#                 # "photos": uploaded_file,
#                 # "post": statement
#                 })



# @post_router.post("/delete/post")
# async def auth_p(request: Request, id: int):#token: str,
#     try:
#         token = request.cookies.get(cfg.JWT_ACCESS_COOKIE_NAME)
#         # print(f"{bool(token)}")

#         if not token:
#             # raise HTTPException(status_code=401, detail="Authentication Error")
#             return RedirectResponse(url=f"{config.WEBAPP_URL}/login", status_code=401)

#         payload=jwt.decode(
#             token,
#             cfg.JWT_SECRET_KEY,
#             algorithms=["HS256"],
#             options={"verify_exp": True}
#         )
#         # data = await get_user(int(payload["sub"]))# db.get_user(int(payload["sub"]))

#         # print(f'{statement}, {images}')
#         return JSONResponse(
#             status_code=200,
#             content={
#                 "status": "success"
#                 })

#     except Exception as e:
#         print(f"{e}")
#         return JSONResponse(
#             status_code=400,
#             content={
#                 "status": "wrong"
#                 # "photos": uploaded_file,
#                 # "post": statement
#                 })





from fastapi import APIRouter, Request, UploadFile, Form, File, HTTPException, Query
from fastapi.responses import JSONResponse, RedirectResponse
from typing import List, Optional
import json
import jwt

from DB import *
from config import config

from .downloader import download_photo
from .S3 import s3_client
from backend.OAuth.login import UserLoginSchema, cfg, Security

post_router = APIRouter(prefix="/api/statements")


def parse_tags_input(tags: str | list[str] | None) -> list[str]:
    if tags is None:
        return []

    if isinstance(tags, list):
        raw_tags = tags
    else:
        try:
            parsed = json.loads(tags)
            raw_tags = parsed if isinstance(parsed, list) else [parsed]
        except (json.JSONDecodeError, TypeError):
            raw_tags = tags.split(",") if isinstance(tags, str) else []

    normalized_tags = []
    for tag in raw_tags:
        if not isinstance(tag, str):
            continue
        cleaned_tag = tag.strip().lower()
        if cleaned_tag and cleaned_tag not in normalized_tags:
            normalized_tags.append(cleaned_tag)

    return normalized_tags


@post_router.get("/search")
async def search_posts(tags: str = Query(..., description="Comma-separated tags or JSON array")):
    try:
        tags_list = parse_tags_input(tags)
        if not tags_list:
            return JSONResponse(
                status_code=200,
                content={
                    "status": "success",
                    "tags": [],
                    "results": []
                }
            )

        results = await search_states_by_tags(tags_list)
        if results is False or results is None:
            raise ValueError("Failed to search posts by tags")

        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "tags": tags_list,
                "results": results
            }
        )
    except Exception as e:
        print(f"Error in post search: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": str(e)
            }
        )

@post_router.get("/feed")
async def get_posts_feed(limit: int = Query(50, ge=1, le=100)):
    try:
        results = await get_feed_states(limit)
        if results is False or results is None:
            raise ValueError("Failed to load posts feed")

        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "results": results
            }
        )
    except Exception as e:
        print(f"Error loading posts feed: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": str(e)
            }
        )

@post_router.get("/{post_id}")
async def get_post_by_id(post_id: int):
    try:
        result = await get_state(post_id)
        if not result:
            return JSONResponse(
                status_code=404,
                content={
                    "status": "error",
                    "message": "Post not found"
                }
            )

        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "result": result
            }
        )
    except Exception as e:
        print(f"Error loading post by id: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": str(e)
            }
        )

@post_router.post("/post")
async def auth_p(
    request: Request,
    statement: str = Form(...),
    name: str = Form(...),
    tags: str = Form(...),  # Получаем теги как строку JSON
    images: List[UploadFile] = File(default=[]),
):
    try:
        token = request.cookies.get(cfg.JWT_ACCESS_COOKIE_NAME)
        
        if not token:
            return RedirectResponse(url=f"{config.WEBAPP_URL}/login", status_code=401)
        
        # Декодируем JWT токен
        payload = jwt.decode(
            token,
            cfg.JWT_SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        
        user_id = int(payload["sub"])
        
        # Парсим теги из JSON строки
        tags_list = parse_tags_input(tags)
        
        # Обрабатываем изображения
        s = []
        if images:
            res = await download_photo(user_id, images)
            for i in range(len(res)):
                object_name = await s3_client.upload_file(res[i])
                if not object_name:
                    raise ValueError("Failed to upload image to object storage")
                s.append(f'https://7510ee71-be04-4432-82ff-85c3551baf7f.selstorage.ru/{object_name}')
        
        # Добавляем состояние (пост) в базу данных
        id_state = await add_state(name, statement, user_id, tags_list, s)
        if not id_state:
            raise ValueError("Failed to create post")

        # Добавляем связь поста с пользователем
        user_statement = await add_user_statement(user_id, id_state)
        if user_statement is False:
            raise ValueError("Failed to link post to user")
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "post_id": id_state,
                "message": "Post created successfully"
            }
        )
        
    except jwt.ExpiredSignatureError:
        return JSONResponse(
            status_code=401,
            content={
                "status": "error",
                "message": "Token expired"
            }
        )
    except jwt.InvalidTokenError:
        return JSONResponse(
            status_code=401,
            content={
                "status": "error",
                "message": "Invalid token"
            }
        )
    except Exception as e:
        print(f"Error in post creation: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": str(e)
            }
        )
