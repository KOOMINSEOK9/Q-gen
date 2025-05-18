// API 응답 기본 타입
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}

// 단일 문제 조회 응답 타입
export interface TestQuestion {
  testId: number;
  type: 'choiceAns' | 'shortAns' | 'oxAns';
  question: string;
  explanation: string[];
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

// 답안 제출 요청 타입
export interface SubmitAnswerRequest {
  testId: number;
  userAnswer: string;
}

// 답안 제출 응답 타입
export interface TestResult {
  testId: number;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  userAnswer: string;
  correctAnswer: string;
  comment: string;
  correct: boolean;
}
