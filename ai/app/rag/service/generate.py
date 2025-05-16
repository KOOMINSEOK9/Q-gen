import json
import logging
import asyncio
from dotenv import load_dotenv
import os
from openai import OpenAI
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from app.rag.prompt.prompt import load_choice_prompt, load_oxshort_prompt
import math


load_dotenv()
logger = logging.getLogger(__name__)
executor = ThreadPoolExecutor()
client = OpenAI()

MAX_RETRY = 3

def call_openai(client: OpenAI, prompt: str, context: str, q_type: str) -> str:
    logger.info(f"\n🧠 [GPT 요청 컨텍스트 - {q_type.upper()}]\n" + context[:1000])

    if q_type == "choice":
        user_message = (
            f"반드시 JSON 문자열로만 응답해야 돼. 아래 컨텍스트는 여러 개의 문제 자료로 구성되어 있으며, 각 자료는 '--- 문제 구분 ---' 으로 나뉘어 있어. 각 구분자 단위를 독립된 문제로 간주해. 해당 내용을 참고해서 문제를 만들어봐:\n\n{context}"
        )
    elif q_type == "oxshort":
        user_message = (
            f"반드시 JSON 문자열로만 응답해야 돼. 다음 내용을 근거로 문제를 만들어줘:\n\n{context}"
        )
    else:
        raise ValueError(f"알 수 없는 문제 유형: {q_type}")

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=1
    )

    raw = response.choices[0].message.content
    logger.info(f"\n📦 [GPT 응답 결과 - {q_type.upper()}]\n" + raw[:1000])
    return raw

async def _run_gpt(prompt: str, context: str, q_type: str) -> str:
    for attempt in range(1, MAX_RETRY + 1):
        try:
            loop = asyncio.get_running_loop()
            return await loop.run_in_executor(
                executor,
                call_openai,
                client,
                prompt,
                context,
                q_type
            )
        except Exception as e:
            logger.warning(f"[GPT 시도 {attempt} - {q_type}] 실패: {e}")
            if attempt == MAX_RETRY:
                raise RuntimeError(f"{q_type.upper()} GPT 호출 최대 재시도 초과")
            
def _split_batches(total: int, max_batch_size: int) -> list[int]:
    """
    총 문제 수를 최대 max_batch_size 크기로 나눈 리스트 반환
    예: total=25 → [10, 10, 5]
    """
    full_batches = total // max_batch_size
    remainder = total % max_batch_size
    return [max_batch_size] * full_batches + ([remainder] if remainder else [])

def _split_chunks(chunks: list[str], num_parts: int) -> list[list[str]]:
    """
    chunks를 num_parts 개수로 균등하게 분할하여 리스트로 반환
    """
    if num_parts == 0:
        return []
    avg = len(chunks) / num_parts
    return [chunks[round(i * avg): round((i + 1) * avg)] for i in range(num_parts)]

async def generate_problem(choice_chunks: list[str], oxshort_chunks: list[str], choice: int, ox: int, short: int):
    tasks = []

    # 객관식 문제 요청 분할
    if choice > 0:
        choice_batches = _split_batches(choice, max_batch_size=10)
        chunk_batches = _split_chunks(choice_chunks, len(choice_batches))

        for count, context_chunk in zip(choice_batches, chunk_batches):
            prompt = load_choice_prompt(count)
            context = "\n--- 문제 구분 ---\n".join(context_chunk)
            tasks.append(_run_gpt(prompt, context, "choice"))

    #OX + 주관식 문제 요청 분할 ---
    total_oxshort = ox + short
    if total_oxshort > 0:
        oxshort_batches = _split_batches(total_oxshort, max_batch_size=10)
        chunk_batches = _split_chunks(oxshort_chunks, len(oxshort_batches))

        # 첫 번째 요청은 OX 위주, 그 다음은 SHORT 위주로 분배
        for i, (count, context_chunk) in enumerate(zip(oxshort_batches, chunk_batches)):
            ox_count = min(count, ox) if ox > 0 else 0
            short_count = count - ox_count
            ox -= ox_count
            short -= short_count

            prompt = load_oxshort_prompt(ox_count, short_count)
            context = "\n".join(context_chunk)
            tasks.append(_run_gpt(prompt, context, "oxshort"))

    # GPT 요청 실행
    gpt_outputs = await asyncio.gather(*tasks)

    # 결과 파싱
    results = []
    for raw in gpt_outputs:
        try:
            if not isinstance(raw, str):
                raise ValueError("GPT 응답이 문자열이 아님")
            parsed = json.loads(raw)
            assert isinstance(parsed, list)
            results.extend(parsed)
        except Exception as e:
            logger.error(f"⚠️ GPT 응답 파싱 실패: {e}\n원문:\n{raw[:1000]}")
            raise ValueError(f"GPT 응답 파싱 실패: {e}")

    return results
