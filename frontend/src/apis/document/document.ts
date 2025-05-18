import { DocumentInfo } from '@/types/document';
import axiosInstance from '@/apis/axiosInstance';

// 자료 업로드 api
export const uploadDocumentByWorkBookId = async (
  file: File,
  workBookId: number
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('workBookId', workBookId.toString());

  const response = await axiosInstance.post('/api/document/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// 특정 워크북의 업로드된 파일 전체 조회
export const fetchDocumentsByWorkBook = async (
  workBookId: number
): Promise<DocumentInfo[]> => {
  const response = await axiosInstance.get(
    `/api/document/workbook/${workBookId}`
  );
  console.log('문제집', workBookId, '의 조회된 파일 목록', response.data);
  return response.data.data;
};

// 파일 삭제 API
export const deleteDocumentByDocumentId = async (documentId: number) => {
  const response = await axiosInstance.delete(`/api/document/${documentId}`);
  return response.data;
};

// 파일 상세 조회
export const fetchDocumentByDocumentId = async (documentId: number) => {
  const response = await axiosInstance.get(`/api/document/${documentId}`);
  console.log(
    '[DOC DETAIL API] documentId:',
    documentId,
    'response:',
    response.data
  );
  return response.data.data;
};

// 텍스트 입력 txt파일 변환
export const convertTextToTxt = async (workBookId: number, text: string) => {
  console.log('텍스트 업로드 시작:', workBookId, text);
  const response = await axiosInstance.post(
    `/api/document/text`,
    { workBookId, text },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('텍스트 업로드 결과:', response.data.data);
  return response.data.data;
};

// url txt파일 변환
export const convertUrlToTxt = async (workBookId: number, url: string) => {
  const response = await axiosInstance.post(
    `/api/document/url?workBookId=${workBookId}&url=${url}`
  );
  return response.data.data;
};

// 파일 다운로드
export const downloadDocumentByDocumentId = async (documentId: number) => {
  const response = await axiosInstance.get(
    `/api/document/download/${documentId}`,
    { responseType: 'blob' }
  );
  return response.data;
};
