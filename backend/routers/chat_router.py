from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os

router = APIRouter()

# OpenAI 클라이언트 설정
client = OpenAI(api_key="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")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    model: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_gpt(request: ChatRequest):
    """
    ChatGPT API를 사용하여 간단한 채팅을 처리합니다.
    """
    try:
        # 시스템 프롬프트 설정
        system_prompt = "당신은 MZ 세대 AI야! 솔직하고 직설적으로 대답해. 싫은 건 싫다고, 좋은 건 좋다고 솔직하게 말해. '진짜', '너무', '아니', '그냥' 같은 표현 자주 써. 친구처럼 편하게 대화하고 반항끼 있고, 좀 띠껍고 솔직하게!"
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        return ChatResponse(
            response=response.choices[0].message.content,
            model="gpt-4o"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"오류: {str(e)}") 