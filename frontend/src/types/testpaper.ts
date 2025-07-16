export interface TestPaper {
  testPaperId: number;
  title: string;
  choiceAns: number;
  shortAns: number;
  quantity: number;
  createAt: string;
  oxAns: number;
}

export interface TestPaperListResponse {
  success: boolean;
  status: number;
  message: string;
  data: TestPaper[] | null;
  timestamp: string;
  path: string;
}

export interface CreateTestPaperRequest {
  workBookId: number;
  title: string;
  choiceAns: number;
  shortAns: number;
  oxAns: number;
  quantity: number;
}
