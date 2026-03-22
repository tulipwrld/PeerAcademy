import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from aifunc import aifunc
from DB import *

# async def lifespan(app: FastAPI):

#     await initialize_database()
#     # await initialize_gift_database()
#     # await initialize_tasks_database()
#     # await initialize_game_database()

#     yield

app = FastAPI()#lifespan=lifespan)#lifespan=lifespan

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #"http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AIRequest(BaseModel):
    article_text: str
    question: str


@app.post('/api/ai')
async def explain(payload: AIRequest):
    answer = await aifunc(payload.article_text, payload.question)
    return JSONResponse(
        status_code=200,
        content={
            "status": "success",
            "answer": answer
        }
    )

#____________________________________________________________________________________________________
if __name__ == "__main__":
    # uvicorn.run(app, host=config.APP_HOST, port=config.APP_PORT)
    uvicorn.run("AI.main:app", reload=True, host="localhost", port=8001)
    # uvicorn.run("server.main:app", reload=True, host="localhost", port=8000)
