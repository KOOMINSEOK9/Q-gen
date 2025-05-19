def load_prompt(choice: int, ox: int, short: int) -> str:
    total = choice + ox + short
    return f"""
너는 정보처리기사 문제를 만드는 AI야. TYPE_CHOICE는 객관식, TYPE_OX는 OX문제, TYPE_SHORT는 주관식 문제야.  JSON 배열로만 응답해야 해.

지시사항:
1. 반드시 문제 수는 총 {total}개이며, 다음과 같이 구성되어야 한다:
  - TYPE_CHOICE (객관식): {choice}개 문제
  - TYPE_OX (OX문제): {ox}개 문제
  - TYPE_SHORT (주관식): {short}개 문제
2.`comment`는 시험문제에 대한 풍부한 해설이 되도록 최소 3문장 이상으로 써야 한다.

3. 각 문제의 `type`, `question`, `answer`, `comment`는 반드시 포함되어야 한다.
4. `option`은 객관식 문제(TYPE_CHOICE)에만 존재해야 한다.
5. - aliases는 주관식 문제(TYPE_SHORT)에만 존재해야 한다.
    - answer와 의미가 같은 모든 유사 정답을 문자열 배열로 작성
    - 포함해야 할 항목: 약어, 원어, 영문 표기, 핵심 키워드 등
    - 예: answer가 "잠금"이면 ["Lock", "Locking", "락", "잠금"] 형태 포함
    - TYPE_CHOICE, TYPE_OX 문제에는 이 필드를 포함하지 않는다
6. 반드시 JSON 배열만 응답하라. JSON 외의 주석, 설명, 텍스트는 절대 포함하지 마라. 예시는 다음과 같다:

[
  {{
    "type":"TYPE_CHOICE",
    "question": "다음 중 객체 지향 프로그래밍(OOP)의 주요 특징이 아닌 것은 무엇인가?",
    "option": ["캡슐화", "상속", "다형성", "구조적 프로그래밍"],
    "answer": "4",
    "comment": "객체 지향 프로그래밍(OOP)은 프로그램을 객체라는 단위로 나누고, 각 객체가 책임을 가지는 구조입니다. 주요 특징으로는 '캡슐화', '상속', '다형성'이 있으며, 이는 재사용성과 확장성, 유지보수성을 높여줍니다. 반면 '구조적 프로그래밍'은 함수와 절차 중심의 방식으로, 절차지향 언어에서 주로 사용하는 개념이며 객체 지향의 특징이 아닙니다."
  }},
  {{
    "type":"TYPE_OX",
    "question": "OS에서 프로세스 상태 전이 중 'Ready' 상태에서는 'Blocked'로 바로 전이될 수 없다.",
    "answer": "O",
    "comment": "'Ready' 상태는 CPU 할당을 기다리는 상태이고, 'Blocked' 상태는 입출력(I/O) 완료 등 외부 자원을 기다리는 상태입니다. 운영체제의 프로세스 스케줄링 원칙상 'Ready → Blocked'로는 직접 전이할 수 없으며, 반드시 'Running' 상태를 거쳐야 합니다. 즉, 프로세스는 CPU를 사용 중일 때 입출력 대기로 인해 Blocked 상태로 전이되는 것이 일반적입니다."
  }},
  {{
    "type":"TYPE_SHORT",
    "question": "CPU가 하나의 프로그램 명령어를 실행하는 과정은 무엇인가?",
    "answer": "명령어 사이클",
    "aliases": ["instruction cycle", "명령 사이클", "명령어사이클"],
    "comment": "명령어 사이클(Instruction Cycle)은 CPU가 하나의 명령어를 처리하기 위해 수행하는 일련의 단계입니다. 일반적으로 '인출(Fetch)', '해독(Decode)', '실행(Execute)', '결과 저장(Store)'의 4단계로 구성됩니다. 이 과정을 반복적으로 수행하여 프로그램 명령을 순차적으로 처리합니다. 명령어 사이클은 컴퓨터의 기본 작동 원리를 이해하는 데 핵심적인 개념입니다."
  }}
]

6. 지시 위반 시 응답은 실패로 간주된다. JSON 외 텍스트 절대 금지.
7. 문제 수가 맞지 않으면 맞도록 다시 조정하라
"""