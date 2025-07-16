from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from environs import Env
from app.problem_generator.prompt import load_prompt
import json
import logging

router = APIRouter()  # <-- 바뀐 부분
env = Env()
env.read_env()

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 요청 받을 때 사용할 모델
class Request(BaseModel):
    quantity: int

@router.post("/chatgpt/{testPaperId}/", status_code=status.HTTP_200_OK)
async def chatgpt_api(testPaperId: int, request: Request):
    client = OpenAI(api_key=env.str("OPENAI_API_KEY"))

    try:
        logger.info(f"요청: testPaperId={testPaperId}, quantity={request.quantity}")

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": load_prompt(request.quantity)},
                {"role": "user", "content": f"반드시 {request.quantity}개의 문제를 만들어주세요."}
            ],
            temperature=1
        )

        # 응답에서 직접 content에 접근
        response_content = response.choices[0].message.content

        # 응답이 JSON으로 올 것이라고 기대하고 파싱
        try:
            parsed_content = json.loads(response_content)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="응답이 JSON 형식이 아닙니다.")

        problems = None
        if isinstance(parsed_content, dict):
            if "questions" in parsed_content:
                problems = parsed_content["questions"]
            else:
                problems = [parsed_content]  # 하나짜리 문제 dict이면 리스트로 감싼다
        elif isinstance(parsed_content, list):
            problems = parsed_content
        else:
            raise HTTPException(status_code=500, detail="응답이 리스트나 dict 형태가 아닙니다.")

        if len(problems) != request.quantity:
            raise HTTPException(
                status_code=500,
                detail=f"요청 문제 수({request.quantity})와 응답 문제 수({len(problems)})가 다릅니다."
            )

        logger.info(f"성공: 문제 {len(problems)}개 생성 완료")
        return {
            "success": True,
            "data": problems
        }

    except Exception as e:
        logger.error(f"서버 에러: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {str(e)}"
        )
