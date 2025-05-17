import json
import logging
import asyncio
import os
from dotenv import load_dotenv
from openai import OpenAI
from concurrent.futures import ThreadPoolExecutor
from app.rag.prompt.prompt import load_choice_prompt, load_oxshort_prompt

load_dotenv()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)
executor = ThreadPoolExecutor()
client = OpenAI()

MAX_RETRY = 3
MAX_BATCH_SIZE = 10

def _split_batches(total: int, max_size: int) -> list[int]:
    full, remain = divmod(total, max_size)
    return [max_size] * full + ([remain] if remain else [])

def _split_chunks(chunks: list[str], n: int) -> list[list[str]]:
    if n == 0: return []
    avg = len(chunks) / n
    return [chunks[round(i * avg): round((i + 1) * avg)] for i in range(n)]

def _build_user_message(context: str, q_type: str) -> str:
    base_msg = "반드시 JSON 문자열로만 응답해야 돼. JSON 외의 주석, 설명, 자연어 문장은 절대 포함하지 마라."
    if q_type == "choice":
        return f"{base_msg} 아래 컨텍스트는 '--- 문제 구분 ---' 으로 나뉘며 각 구간은 독립 문제야:\n\n{context}"
    elif q_type == "oxshort":
        return f"{base_msg} 다음 내용을 근거로 문제를 만들어줘:\n\n{context}"
    else:
        raise ValueError(f"알 수 없는 문제 유형: {q_type}")

def _call_openai(prompt: str, context: str, q_type: str) -> str:
    logger.info(f"\n🧠 [GPT 요청 - {q_type.upper()}]\n{context[:500]}")
    user_message = _build_user_message(context, q_type)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": prompt}, {"role": "user", "content": user_message}],
        temperature=1
    )
    raw = response.choices[0].message.content
    logger.info(f"\n📦 [GPT 응답 - {q_type.upper()}]\n{raw[:500]}")
    return raw

async def _call_gpt_with_retry(prompt: str, context: str, q_type: str) -> list[dict]:
    for attempt in range(1, MAX_RETRY + 1):
        try:
            loop = asyncio.get_running_loop()
            raw = await loop.run_in_executor(executor, _call_openai, prompt, context, q_type)
            parsed = json.loads(raw)
            if not isinstance(parsed, list):
                raise ValueError("GPT 응답이 리스트가 아님")
            return parsed
        except Exception as e:
            logger.warning(f"🔁 [GPT 재시도 {attempt} - {q_type}] 실패: {e}")
            if attempt == MAX_RETRY:
                logger.error(f"❌ GPT 재시도 초과: {e}\n원문:\n{raw[:1000] if 'raw' in locals() else '없음'}")
                raise

async def generate_problem(choice_chunks: list[str], oxshort_chunks: list[str], choice: int, ox: int, short: int):
    tasks = []

    # 객관식
    if choice > 0:
        batches = _split_batches(choice, MAX_BATCH_SIZE)
        chunks = _split_chunks(choice_chunks, len(batches))
        for count, context_chunk in zip(batches, chunks):
            prompt = load_choice_prompt(count)
            context = "\n--- 문제 구분 ---\n".join(context_chunk)
            tasks.append(_call_gpt_with_retry(prompt, context, "choice"))

    # OX + 주관식
    total_oxshort = ox + short
    if total_oxshort > 0:
        batches = _split_batches(total_oxshort, MAX_BATCH_SIZE)
        chunks = _split_chunks(oxshort_chunks, len(batches))
        for count, context_chunk in zip(batches, chunks):
            ox_count = min(count, ox)
            short_count = count - ox_count
            ox -= ox_count
            short -= short_count
            prompt = load_oxshort_prompt(ox_count, short_count)
            context = "\n".join(context_chunk)
            tasks.append(_call_gpt_with_retry(prompt, context, "oxshort"))

    all_results = await asyncio.gather(*tasks)
    return [item for batch in all_results for item in batch]