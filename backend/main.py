from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import character_router, chat_router

app = FastAPI(
    title="3D Character Generation & Chat API",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(character_router.router)
app.include_router(chat_router.router)