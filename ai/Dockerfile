# ✅ 베이스 이미지
FROM python:3.12.8

# ✅ 작업 디렉토리 설정
WORKDIR /app

# ✅ AWS CLI 설치 (S3 다운로드 위해 필요)
RUN apt-get update && \
    apt-get install -y curl unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws

# ✅ 파이썬 패키지 설치
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt

# ✅ 애플리케이션 전체 복사
COPY . .

# ✅ 쉘 스크립트 복사 및 실행 권한 부여
COPY ./download-and-run.sh /app/download-and-run.sh
RUN chmod +x /app/download-and-run.sh

# ✅ 포트 오픈
EXPOSE 8000

# ✅ 애플리케이션 실행 (S3에서 파일 받고 서버 시작)
CMD ["/bin/bash", "-c", "/app/download-and-run.sh"]