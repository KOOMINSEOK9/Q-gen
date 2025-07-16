export interface WorkBook {
  workBookId: number;
  title: string;
  createAt: string;
}

// API 응답 타입 정의
export interface GetWorkBooksResponse {
  data: WorkBook[];
}

// 문제집 생성 요청 타입 : CreateWorkBookRequest , DeleteWorkBookRequest, UpdateWorkBookRequest
export interface WorkBookRequest {
  title: string;
}

// 문제집 생성 응답 타입
export interface CreateWorkBookResponse {
  workBookId: number;
  title: string;
  createAt: string;
}
