import { WorkBook } from '@/types/workbook';
import axiosInstance from '@/apis/axiosInstance';

// 문제집 전체 조회 API
export const getWorkBooks = async (): Promise<WorkBook[]> => {
  try {
    const response = await axiosInstance.get<{ data: WorkBook[] }>(
      `/api/workbooks`
    );
    console.log('222 조회된 문제집 목록 :::: ', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch workbooks:', error);
    throw error;
  }
};

// 문제집 생성 API
export const createWorkBook = async (title: string): Promise<WorkBook> => {
  try {
    const response = await axiosInstance.post<WorkBook>(`/api/workbooks`, {
      title,
    });
    console.log('문제집 생성 응답 : ', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create workbook:', error);
    throw error;
  }
};

// 문제집 삭제 API
export const deleteWorkBook = async (workBookId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/workbooks/${workBookId}`);
  } catch (error) {
    console.error('Failed to delete workbook:', error);
    throw error;
  }
};

// 문제집 수정 API
export const updateWorkBook = async (
  workBookId: number,
  title: string
): Promise<void> => {
  try {
    await axiosInstance.patch(`/api/workbooks/${workBookId}`, {
      title,
    });
  } catch (error) {
    console.error('Failed to update workbook:', error);
    throw error;
  }
};
