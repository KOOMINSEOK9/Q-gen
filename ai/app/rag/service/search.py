import os
import faiss
import json

def load_index_and_store(index_id: str):
    base = f"./data/indexes/{index_id}"
    index = faiss.read_index(f"{base}.faiss")
    with open(f"{base}.json", "r", encoding="utf-8") as f:
        store = json.load(f)
    return index, store

def search_with_index(index, store, query_np, k: int):
    D, I = index.search(query_np, k=k)
    
    results = [store[i] for i in I[0] if 0 <= i < len(store)]
    
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"[🔍 벡터 검색 결과] top-{k} 거리: {D[0]}")
    for i, idx in enumerate(I[0]):
        if 0 <= idx < len(store):
            logger.info(f"[🔎 검색 {i+1}] 인덱스 {idx} → 내용 일부: {str(store[idx])[:300]}")
        else:
            logger.warning(f"[⚠️ 검색 {i+1}] 유효하지 않은 인덱스: {idx}")
    
    return results

def search_with_index_return_distance(index, store, query_np_array, k: int):
    D, I = index.search(query_np_array, k=k)
    results = []
    for i, idx in enumerate(I[0]):
        if 0 <= idx < len(store):
            results.append((store[idx], D[0][i]))
    return results