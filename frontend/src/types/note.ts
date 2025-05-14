export interface NoteProps {
  currentNumber: number;
  totalNumber: number;
  test: string;
  options: string[];
  selectedOption: number | null;
  isSubmitted: boolean;
  answerIndex: number;
  explanation: string;
  incorrectCount: number;
  onSelect: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export interface TestListProps {
  currentNumber: number;
  totalTests: number;
  testDetails?: NoteTestDetail[];
  onTestClick: (testNumber: number) => void;
}

// 시험지 전체 조회 응답 타입 (API)
export interface TestPaper {
  testPaperId: number;
  title: string;
  quantity: number;
}

export interface GetNoteTestPapersResponse {
  success: boolean;
  status: number;
  message: string;
  data: TestPaper[];
  timestamp: string;
  path: string;
}

// 문제 상세 조회 응답 타입 (API)
export interface NoteTestHistory {
  testHistoryId: number;
  testId: number;
  createAt: string;
  userAnswer: string;
  correct: boolean;
}

export interface NoteTestDetail {
  testId: number;
  question: string;
  type: 'choiceAns' | 'shortAns' | 'oxAns';
  option1: string | null;
  option2: string | null;
  option3: string | null;
  option4: string | null;
  answer: string;
  comment: string;
  memo: string | null;
  testHistoryList: NoteTestHistory[];
  incorrectCount: number;
}

export interface GetNoteTestDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: NoteTestDetail;
  timestamp: string;
  path: string;
}

// 시험지 별 문제 id 전체 조회 응답 타입 (API)
export interface GetNoteTestIdListResponse {
  success: boolean;
  status: number;
  message: string;
  data: number[];
  timestamp: string;
  path: string;
}
