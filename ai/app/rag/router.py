from fastapi import APIRouter, HTTPException
from app.rag.model.s3_request import S3UploadRequest
from app.rag.service.extract import extract_chunks_from_urls
from app.rag.service.embedding import get_embedding_from_gpu
from app.rag.service.search import load_index_and_store, search_with_index
from app.rag.service.generate import generate_problem
import numpy as np

router = APIRouter()

@router.post("/search/{testPaperId}/")
async def search_with_uploaded_file(testPaperId: int, request: S3UploadRequest):
    chunks = extract_chunks_from_urls(request.s3Urls)

    if not chunks:
        raise HTTPException(status_code=400, detail="사용자 파일에서 텍스트 추출 실패")

    query_text = " ".join(chunks)
    query_vec = await get_embedding_from_gpu([query_text])
    query_np = np.array(query_vec).astype(np.float32).reshape(1, -1)

    choice_chunks = []
    oxshort_chunks = []

    if request.choiceAns > 0:
        q_index, q_store = load_index_and_store("questions")
        choice_chunks = search_with_index(q_index, q_store, query_np, request.choiceAns)

    if request.oxAns + request.shortAns > 0:
        i_index, i_store = load_index_and_store("info")
        oxshort_chunks = search_with_index(i_index, i_store, query_np, request.oxAns + request.shortAns)

    if not choice_chunks and not oxshort_chunks:
        raise HTTPException(status_code=404, detail="검색 결과 없음")

    # 문제 생성
    generated = await generate_problem(
        choice_chunks=choice_chunks,
        oxshort_chunks=oxshort_chunks,
        choice=request.choiceAns,
        ox=request.oxAns,
        short=request.shortAns
    )

    return {
        "success": True,
        "data": generated
    }