import re
import requests
import tempfile
import pdfplumber
import io
from docx import Document
from app.rag.util.clean_text import clean_text

def split_text_by_sentence(text: str, chunk_size: int = 256, overlap: int = 25) -> list[str]:
    sentences = re.split(r'(?<=[.?!])\s+', text)
    chunks = []
    current = ""

    for sentence in sentences:
        if len(current) + len(sentence) <= chunk_size:
            current += sentence + " "
        else:
            chunks.append(current.strip())
            current = sentence + " "

    if current:
        chunks.append(current.strip())

    # 겹침 처리
    final_chunks = []
    for i in range(0, len(chunks)):
        start = max(0, i - 1)
        combined = " ".join(chunks[start:i+1])
        final_chunks.append(combined.strip())

    return final_chunks

def extract_text_from_bytes(content: bytes, filename: str = "") -> list[str]:
    try:
        # 텍스트 파일 처리
        if filename.endswith(".txt"):
            text = content.decode("utf-8", errors="ignore")
            return [text]

        # PDF 파일 처리
        elif filename.endswith(".pdf"):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(content)
                temp_file_path = temp_file.name

            texts = []
            with pdfplumber.open(temp_file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        texts.append(page_text)
            return texts

        # DOCX 파일 처리
        elif filename.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            return [p.text for p in doc.paragraphs if p.text.strip()]

        else:
            print(f"지원되지 않는 파일 형식: {filename}")
            return []

    except Exception as e:
        print(f"텍스트 추출 실패: {e}")
        return []

def extract_chunks_from_urls(s3_urls: list[str]) -> list[str]:
    chunks = []
    for url in s3_urls:
        try:
            res = requests.get(url)
            res.raise_for_status()

            # 파일 이름 추정 (확장자 판단용)
            filename = url.split("?")[0].split("/")[-1]  # 쿼리 스트링 제거 후 파일명만 추출

            texts = extract_text_from_bytes(res.content, filename)
            cleaned = clean_text(" ".join(texts))
            split_chunks = split_text_by_sentence(cleaned)
            chunks.extend(split_chunks)
        except Exception as e:
            print(f"URL 처리 실패 {url}: {e}")
            continue
    return chunks