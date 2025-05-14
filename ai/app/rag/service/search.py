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
    return [store[i] for i in I[0] if 0 <= i < len(store)]