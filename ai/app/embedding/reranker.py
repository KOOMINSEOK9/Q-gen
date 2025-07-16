from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

tokenizer = AutoTokenizer.from_pretrained("BAAI/bge-reranker-base")
model = AutoModelForSequenceClassification.from_pretrained("BAAI/bge-reranker-base")
model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

class QueryCandidatePair(BaseModel):
    query: str
    candidate: str

class RerankBatchRequest(BaseModel):
    pairs: list[QueryCandidatePair]
    top_n: int
    dedup: bool = False

class RerankedItem(BaseModel):
    candidate: str
    score: float

class RerankBatchResponse(BaseModel):
    reranked: list[RerankedItem]

@router.post("/reranker", response_model=RerankBatchResponse)
def rerank_batch(request: RerankBatchRequest):
    if not request.pairs:
        logger.info("❗ 요청된 쌍이 없습니다. 빈 리스트 반환")
        return {"reranked": []}

    text_pairs = [(p.query, p.candidate) for p in request.pairs]
    inputs = tokenizer(text_pairs, padding=True, truncation=True, return_tensors="pt").to(device)

    with torch.no_grad():
        scores = model(**inputs).logits.squeeze(-1)

    top_k = min(request.top_n * 3, len(request.pairs))
    top_indices = torch.topk(scores, k=top_k).indices.tolist()

    result = []
    seen = set()
    for i in top_indices:
        pair = request.pairs[i]
        candidate = pair.candidate
        score = scores[i].item()
        if request.dedup and candidate in seen:
            continue
        seen.add(candidate)
        result.append(RerankedItem(candidate=candidate, score=score))
        if len(result) == request.top_n:
            break

    # ✅ 최종 결과 로그 출력
    logger.info(f"📦 리랭커 최종 결과 (top {len(result)}):")
    for rank, item in enumerate(result, start=1):
        logger.info(f"{rank}. 점수: {item.score:.4f} / 청크: {item.candidate[:200]}...")

    return {"reranked": result}