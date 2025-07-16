import re
import requests
import tempfile
import pdfplumber
import io
from docx import Document
from app.rag.util.clean_text import clean_text


def split_text_by_sentence(text: str, chunk_size: int = 512, overlap: int = 0) -> list[str]:
    print(f"\n🪓 [split_text_by_sentence] 입력 길이: {len(text)}")

    sentences = re.split(r'(?<=[.?!])\s+', text)
    print(f"🔹 문장 개수: {len(sentences)}")

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

    print(f"🔸 1차 청크 수 (overlap 전): {len(chunks)}")

    final_chunks = []
    for i in range(len(chunks)):
        start = max(0, i - overlap)
        combined = " ".join(chunks[start:i+1])
        final_chunks.append(combined.strip())

    result = [chunk for chunk in final_chunks if chunk]
    print(f"✅ 최종 청크 수 (빈 문자열 제거 후): {len(result)}")
    return result


def extract_text_from_bytes(content: bytes, filename: str = "") -> list[str]:
    print(f"\n📂 [extract_text_from_bytes] 파일명: {filename}, 크기: {len(content)} bytes")

    try:
        if filename.endswith(".txt"):
            text = content.decode("utf-8", errors="ignore")
            print(f"📝 텍스트 파일 추출 완료: {len(text)}자")
            return [text]

        elif filename.endswith(".pdf"):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(content)
                temp_file_path = temp_file.name

            texts = []
            with pdfplumber.open(temp_file_path) as pdf:
                print(f"📄 PDF 페이지 수: {len(pdf.pages)}")
                for i, page in enumerate(pdf.pages):
                    page_text = page.extract_text()
                    if page_text:
                        print(f"  📖 Page {i+1}: {len(page_text)}자 | {hash(page_text)}")
                        texts.append(page_text)
            return texts

        elif filename.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            texts = [p.text for p in doc.paragraphs if p.text.strip()]
            print(f"📘 DOCX 문단 수: {len(texts)}")
            return texts

        else:
            print(f"❌ 지원되지 않는 파일 형식: {filename}")
            return []

    except Exception as e:
        print(f"❌ 텍스트 추출 실패: {e}")
        return []


def extract_chunks_from_urls(s3_urls: list[str]) -> list[str]:
    print(f"\n🌐 [extract_chunks_from_urls] 총 URL 수: {len(s3_urls)}")
    chunks = []
    for idx, url in enumerate(s3_urls):
        try:
            print(f"\n🔗 [{idx+1}] 요청 URL: {url}")
            res = requests.get(url)
            res.raise_for_status()

            filename = url.split("?")[0].split("/")[-1]
            texts = extract_text_from_bytes(res.content, filename)

            print(f"🧹 원본 텍스트 블록 수: {len(texts)}")
            for i, t in enumerate(texts):
                print(f"   └ [{i+1}] {len(t)}자 | 해시: {hash(t)} | 시작: {repr(t[:50])}")

            combined = " ".join(texts)
            cleaned = clean_text(combined)

            print(f"🧼 정제 후 텍스트 길이: {len(cleaned)} | 해시: {hash(cleaned)}")
            split_chunks = split_text_by_sentence(cleaned)

            for i, c in enumerate(split_chunks):
                print(f"   📦 청크 {i+1} | 길이: {len(c)} | 해시: {hash(c)} | 시작: {repr(c[:50])}")

            chunks.extend(split_chunks)
        except Exception as e:
            print(f"❌ URL 처리 실패 {url}: {e}")
            continue

    print(f"\n🧾 전체 최종 청크 수 (중복 제거 전): {len(chunks)}")
    return chunks