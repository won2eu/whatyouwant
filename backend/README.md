# 3D Character Generation & Chat API

사용자 사진을 입력받아 3D 캐릭터를 생성하고, ChatGPT API를 사용한 대화 기능을 제공하는 FastAPI 백엔드입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
pip install -r requirements.txt
```

### 2. 서버 실행
```bash
python run_server.py
```

서버가 `http://localhost:8000`에서 실행됩니다.

## API 엔드포인트

### 1. 캐릭터 생성
**POST** `/generate-character`

사용자 사진을 업로드하여 3D 캐릭터를 생성합니다.

**요청:**
- `image`: 이미지 파일 (PNG, JPG, JPEG 지원)

**응답:**
- 생성된 GLB 파일 (3D 모델)

### 2. ChatGPT 채팅 API

#### 2.1 간단한 채팅
**POST** `/api/chat/simple`

간단한 메시지를 보내고 응답을 받습니다.

**요청:**
```json
{
  "message": "안녕하세요!"
}
```

**응답:**
```json
{
  "response": "안녕하세요! 무엇을 도와드릴까요?",
  "model": "gpt-3.5-turbo"
}
```

#### 2.2 고급 채팅
**POST** `/api/chat/chat`

메시지 배열을 사용한 대화형 채팅입니다.

**요청:**
```json
{
  "messages": [
    {"role": "system", "content": "당신은 친근한 AI 어시스턴트입니다."},
    {"role": "user", "content": "파이썬 코드를 알려주세요."}
  ],
  "model": "gpt-3.5-turbo",
  "max_tokens": 1000,
  "temperature": 0.7
}
```

**응답:**
```json
{
  "response": "파이썬 코드 예시...",
  "model": "gpt-3.5-turbo",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

#### 2.3 사용 가능한 모델 조회
**GET** `/api/chat/models`

사용 가능한 ChatGPT 모델 목록을 조회합니다.

**응답:**
```json
{
  "available_models": ["gpt-4", "gpt-3.5-turbo", ...],
  "recommended_models": ["gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]
}
```

## 처리 과정

1. **이미지 업로드**: 사용자가 사진을 업로드
2. **이미지 리사이징**: RGBA와 images 폴더에 복사
3. **SiTH 실행**: `run.sh` 스크립트 실행
4. **3D 재구성**: `reconstruct.py` 실행
5. **텍스처링**: Blender를 통한 자동 텍스처링
6. **결과 출력**: GLB 파일 생성

## 환경 설정

### OpenAI API 키 설정
ChatGPT API를 사용하려면 OpenAI API 키를 설정해야 합니다:

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

### 테스트
ChatGPT API 테스트를 실행하려면:

```bash
python test_chat_api.py
```

## 주의사항

- 이미지 파일은 PNG, JPG, JPEG 형식만 지원합니다.
- 처리 시간은 이미지 크기와 시스템 성능에 따라 달라집니다.
- 생성된 파일은 `SiTH/data/examples/output/` 폴더에 저장됩니다.
- ChatGPT API 사용 시 API 키가 올바르게 설정되어야 합니다. 