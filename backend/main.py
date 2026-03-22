import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import config
from OAuth.router import auth_router
from Lessons import post_router

from DB import *

async def lifespan(app: FastAPI):

    await initialize_database()
    await initialize_database_states()

    yield

app = FastAPI(lifespan=lifespan)#lifespan=lifespan

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.WEBAPP_URL], #"http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(post_router)

# app.include_router(urouter)
# app.include_router(trouter)
# app.include_router(qrouter)
# app.include_router(frouter)
# app.include_router(gsrouter)
# app.include_router(msrouter)
# app.include_router(crouter)
# app.include_router(gmrouter)

#____________________________________________________________________________________________________
if __name__ == "__main__":
    # uvicorn.run(app, host=config.APP_HOST, port=config.APP_PORT)
    uvicorn.run("backend.main:app", reload=True, host=config.APP_HOST, port=config.APP_PORT)
    # uvicorn.run("server.main:app", reload=True, host="localhost", port=8000)