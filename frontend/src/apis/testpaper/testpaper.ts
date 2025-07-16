import {
  CreateTestPaperRequest,
  TestPaperListResponse,
} from '@/types/testpaper';
import axiosInstance from '@/apis/axiosInstance';

// 특정 문제집의 시험지 전체 조회
export const fetchTestPapers = async (
  workBookId: number
): Promise<TestPaperListResponse> => {
  const response = await axiosInstance.get(`/api/testpaper/${workBookId}`);
  return response.data;
};

// 시험지 삭제 API
export const deleteTestPaper = async (workBookId: number) => {
  const response = await axiosInstance.delete(`/api/testpaper/${workBookId}`);
  return response.data;
};

// 시험지명 수정 API
export const updateTestPaperTitle = async (
  testPaperId: number,
  title: string
): Promise<TestPaperListResponse> => {
  const response = await axiosInstance.put('/api/testpaper', {
    testPaperId,
    title,
  });
  return response.data;
};

// 시험지 생성 API
export const createTestPaper = async (
  data: CreateTestPaperRequest
): Promise<TestPaperListResponse> => {
  const response = await axiosInstance.post('/api/testpaper', data);
  return response.data;
};

// PDF 변환 API
export const convertToPdf = async (
  testPaperId: number,
  includeAnswer: boolean
) => {
  const response = await axiosInstance.post(
    '/api/testpaper/convert-pdf',
    { testPaperId, includeAnswer },
    { responseType: 'blob' }
  );
  return response.data;
};
