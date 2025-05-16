export interface TestType {
  name: string;
  count: number;
}

export interface GenerateRequest {
  workBookId: number;
  title: string;
  choiceAns: number;
  shortAns: number;
  oxAns: number;
  quantity: number;
  documentIds: number[];
}

export interface GenerateResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    testPaperId: number;
    title: string;
    choiceAns: number;
    shortAns: number;
    quantity: number;
    createAt: string;
    oxAns: number;
  } | null;
  timestamp: string;
  path: string;
}
