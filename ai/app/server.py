from fastapi import FastAPI
from app.problem_generator.chatgpt import router as chatgpt_router
from app.health_check.health_check import router as health_router
# from upload import router as upload_router

app = FastAPI()

app.include_router(health_router, prefix="/api/ai")
app.include_router(chatgpt_router, prefix="/api/ai")
# app.include_router(upload_router, prefix="/api/ai/upload")