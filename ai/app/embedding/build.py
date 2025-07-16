from fastapi import APIRouter, HTTPException
import os, json, re
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
import faiss
import numpy as np
import boto3
from dotenv import load_dotenv

router = APIRouter()

# 환경 변수 로드
load_dotenv()

# AWS 설정
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# S3 클라이언트 초기화
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION,
)

def upload_to_s3(local_path: str, s3_key: str):
    try:
        s3_client.upload_file(local_path, S3_BUCKET_NAME, s3_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 업로드 실패: {e}")

# 모델 및 설정
model = SentenceTransformer("intfloat/multilingual-e5-large-instruct")
dim = 1024

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=256,
    chunk_overlap=25,
    separators=["\n\n", "\n", " "]
)

def clean_text(text: str) -> str:
    # ❶~❿ (1~10) 변환
    circled_1_to_10 = {
        '❶': '1', '❷': '2', '❸': '3', '❹': '4', '❺': '5',
        '❻': '6', '❼': '7', '❽': '8', '❾': '9', '❿': '10'
    }

    # Ⓐ~Ⓩ (A~Z) 변환
    for i in range(26):
        text = text.replace(chr(0x24B6 + i), chr(65 + i))  # Ⓐ: 0x24B6 → A: 65

    # ①~⑳ (1~20) 변환
    circled_number_map = {
        chr(0x2460 + i): str(i + 1) for i in range(20)  # ①: 0x2460
    }

    # 모든 매핑 적용
    for symbol, value in {**circled_1_to_10, **circled_number_map}.items():
        text = text.replace(symbol, value)

    # 기타 문자 제거 (필요 시 조정)
    text = re.sub(r"[^\w\s\n\-~!@#$%^&*()_+`=\[\]{};:'\",.<>/?\\|]", "", text)
    return re.sub(r"[ \t]+", " ", text).strip()

@router.post("/build")
def build_index(indexId: str = "questions"):
    if indexId not in ["questions", "info"]:
        raise HTTPException(status_code=400, detail="indexId는 'questions' 또는 'info' 중 하나여야 합니다.")

    text_path = f"./data/texts/{indexId}.txt"
    if not os.path.exists(text_path):
        raise HTTPException(status_code=404, detail=f"텍스트 파일 {text_path} 없음")

    with open(text_path, "r", encoding="utf-8") as f:
        raw_text = f.read()

    cleaned = clean_text(raw_text)

    # ✅ '---' 기준으로 청크 분리
    chunks = [chunk.strip() for chunk in cleaned.split('---') if chunk.strip()]

    if not chunks:
        raise HTTPException(status_code=400, detail="청크 생성 실패")

    vectors = model.encode(chunks, batch_size=16, show_progress_bar=True)
    index = faiss.IndexFlatL2(dim)

    for vec in vectors:
        vec_np = np.array(vec).astype(np.float32).reshape(1, -1)
        index.add(vec_np)

    os.makedirs("./data/indexes", exist_ok=True)
    index_path = f"./data/indexes/{indexId}.faiss"
    chunks_path = f"./data/indexes/{indexId}.json"

    faiss.write_index(index, index_path)
    with open(chunks_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    upload_to_s3(index_path, f"faiss/{indexId}.faiss")
    upload_to_s3(chunks_path, f"faiss/{indexId}.json")

    return {
        "message": f"'{indexId}' 인덱스 생성 완료 ('---' 기준)",
        "chunk_count": len(chunks),
        "index_path": index_path
    }