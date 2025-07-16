from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer

router = APIRouter()

# 임베딩 모델 로딩 (GPU 활용)
model = SentenceTransformer("intfloat/multilingual-e5-large-instruct")

class EmbeddingRequest(BaseModel):
    texts: List[str]

@router.post("/embedding")
async def get_embeddings(request: EmbeddingRequest):
    try:
        vectors = model.encode(request.texts)
        return {"embeddings": vectors.tolist()}
    except Exception as e:
        return {"error": str(e)}