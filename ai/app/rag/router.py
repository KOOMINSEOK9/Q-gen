import os
import random
import httpx
import numpy as np
from collections import Counter, defaultdict
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from app.rag.model.s3_request import S3UploadRequest
from app.rag.service.extract import extract_chunks_from_urls
from app.rag.service.embedding import get_embedding_from_gpu
from app.rag.service.search import (
    load_index_and_store,
    search_with_index_return_distance
)
from app.rag.service.generate import generate_problem

load_dotenv()
router = APIRouter()

MAX_QUERY_CHUNKS = 30
TOPK_PER_QUERY = 5
PAIR_FILTER_SIZE = 100
FALLBACK_SEARCH_EXTRA = 2
CONTEXT_EXPAND_MULTIPLIER = 2

@router.post("/search/{testPaperId}/")
async def search_with_uploaded_file(testPaperId: int, request: S3UploadRequest):
    chunks = extract_chunks_from_urls(request.s3Urls)
    if not chunks:
        raise HTTPException(status_code=400, detail="문서에서 텍스트 추출 실패")

    embeddings = await get_embedding_from_gpu(chunks)
    query_np = np.array(embeddings).astype(np.float32)

    choice_chunks, oxshort_chunks = [], []

    if request.choiceAns > 0:
        q_index, q_store = load_index_and_store("questions")
        choice_chunks = await get_context_chunks(
            query_chunks=chunks,
            query_np=query_np,
            index=q_index,
            store=q_store,
            fallback_index_name="questions",
            top_n=request.choiceAns * CONTEXT_EXPAND_MULTIPLIER
        )

    total_oxshort = request.oxAns + request.shortAns
    if total_oxshort > 0:
        i_index, i_store = load_index_and_store("info")
        oxshort_chunks = await get_context_chunks(
            query_chunks=chunks,
            query_np=query_np,
            index=i_index,
            store=i_store,
            fallback_index_name="info",
            top_n=total_oxshort * CONTEXT_EXPAND_MULTIPLIER
        )

    if not choice_chunks and not oxshort_chunks:
        raise HTTPException(status_code=404, detail="검색 결과 없음")

    generated = await generate_problem(
        choice_chunks=choice_chunks,
        oxshort_chunks=oxshort_chunks,
        choice=request.choiceAns,
        ox=request.oxAns,
        short=request.shortAns
    )

    return {"success": True, "data": generated}


async def get_context_chunks(query_chunks, query_np, index, store, fallback_index_name, top_n):
    all_pairs = []
    freq_counter = Counter()
    distance_map = defaultdict(list)

    sample_indices = random.sample(range(len(query_np)), min(MAX_QUERY_CHUNKS, len(query_np)))
    for i in sample_indices:
        query_text = query_chunks[i]
        vec = query_np[i].reshape(1, -1)
        candidates = search_with_index_return_distance(index, store, vec, k=TOPK_PER_QUERY)
        for cand_text, dist in candidates:
            all_pairs.append((query_text, cand_text))
            freq_counter[cand_text] += 1
            distance_map[cand_text].append(dist)

    avg_distance = {text: sum(lst) / len(lst) for text, lst in distance_map.items()}
    sorted_candidates = sorted(freq_counter.items(), key=lambda x: (-x[1], avg_distance[x[0]]))
    top_candidate_set = {text for text, _ in sorted_candidates[:PAIR_FILTER_SIZE]}
    filtered_pairs = [(q, c) for q, c in all_pairs if c in top_candidate_set]

    reranked_chunks = await call_batch_reranker(filtered_pairs, top_n * 2)
    reranked_chunks = list(dict.fromkeys(reranked_chunks))

    if len(reranked_chunks) < top_n:
        needed = top_n - len(reranked_chunks)
        fb_index, fb_store = load_index_and_store(fallback_index_name)
        fallback = search_with_index_return_distance(fb_index, fb_store, query_np, k=needed + FALLBACK_SEARCH_EXTRA)
        fallback_chunks = [text for text, _ in fallback]
        reranked_chunks += fallback_chunks
        reranked_chunks = list(dict.fromkeys(reranked_chunks))

    return reranked_chunks[:top_n]


async def call_batch_reranker(pairs: list[tuple[str, str]], top_n: int) -> list[str]:
    gpu_server = os.getenv("GPU_SERVER_URL")
    if not gpu_server:
        raise RuntimeError("GPU_SERVER_URL 환경 변수가 설정되어 있지 않습니다.")

    reranker_url = f"{gpu_server.rstrip('/')}/reranker"

    try:
        payload = {
            "pairs": [{"query": q, "candidate": c} for q, c in pairs],
            "top_n": top_n,
            "dedup": False
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(reranker_url, json=payload)
            res.raise_for_status()
            return [r["candidate"] for r in res.json()["reranked"]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"리랭커 호출 실패: {e}")

