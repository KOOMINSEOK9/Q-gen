import os
import httpx
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

async def get_embedding_from_gpu(texts: list[str]) -> list[float]:
    base_url = os.getenv("GPU_SERVER_URL")
    print("정상 여부 확인:", repr(base_url))

    if not base_url:
        raise RuntimeError("GPU_SERVER_URL 환경 변수가 설정되어 있지 않습니다.")

    full_url = f"{base_url}/embedding"

    print(f"💬 임베딩 요청 텍스트 (앞 500자):\n{texts[0][:500]}")  # 첫 문장 일부만 출력 (길이 제한)

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            res = await client.post(full_url, json={"texts": texts})
            res.raise_for_status()
            return res.json()["embeddings"][0]
    except Exception as e:
        print(f"❌ GPU 임베딩 서버 호출 오류: {e}")
        raise HTTPException(status_code=500, detail="GPU 임베딩 실패")