#!/bin/bash
set -e

echo "📥 인덱스 다운로드 시작"

mkdir -p /app/data/indexes

aws s3 cp s3://$S3_BUCKET_NAME/faiss/questions.faiss /app/data/indexes/questions.faiss
aws s3 cp s3://$S3_BUCKET_NAME/faiss/questions.json /app/data/indexes/questions.json
aws s3 cp s3://$S3_BUCKET_NAME/faiss/info.faiss /app/data/indexes/info.faiss
aws s3 cp s3://$S3_BUCKET_NAME/faiss/info.json /app/data/indexes/info.json

echo "✅ 다운로드 완료. 서버 시작"

exec uvicorn app.server:app --host 0.0.0.0 --port 8000