import axios from 'axios';
import { GenerateRequest, GenerateResponse } from '@/types/generate';
import axiosInstance from '../axiosInstance';

export const generate = async (
  request: GenerateRequest
): Promise<GenerateResponse> => {
  try {
    const response = await axiosInstance.post<GenerateResponse>(
      '/api/testpaper/generate',
      request
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as GenerateResponse;
    }
    return {
      success: false,
      status: 500,
      message: '시험지 생성 중 오류 발생',
      data: null,
      timestamp: new Date().toISOString(),
      path: '/api/testpaper/generate',
    };
  }
};
