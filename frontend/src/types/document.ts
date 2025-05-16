export interface UploadedFile {
  id: string;
  title: string;
  type: string;
}

// 자료 업로드 파일 목록 조회 API 응답 타입
export interface DocumentInfo {
  documentId: number;
  documentName: string;
  documentSize: number;
  documentType: string;
  createAt: string;
}
