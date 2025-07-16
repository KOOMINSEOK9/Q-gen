import axios from 'axios';
import axiosInstance from '../axiosInstance';
import {
  ApiResponse,
  TestQuestion,
  SubmitAnswerRequest,
  TestResult,
} from '../../types/quiz';

// 단일 문제 조회
export const getTestQuestion = async (
  testId: number
): Promise<ApiResponse<TestQuestion>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<TestQuestion>>(
      `/api/test/${testId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<TestQuestion>;
    }
    return {
      success: false,
      status: 500,
      message: '문제 조회 중 오류 발생',
      data: null,
      timestamp: new Date().toISOString(),
      path: `/api/test/${testId}`,
    };
  }
};

// 전체 문제 ID 배열 조회
export const getTestIdList = async (
  testPaperId: number
): Promise<ApiResponse<number[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<number[]>>(
      `/api/test/list/${testPaperId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<number[]>;
    }
    return {
      success: false,
      status: 500,
      message: '문제 ID 목록 조회 중 오류 발생',
      data: null,
      timestamp: new Date().toISOString(),
      path: `/api/test/list/${testPaperId}`,
    };
  }
};

// 답안 제출
export const submitAnswer = async (
  payload: SubmitAnswerRequest
): Promise<ApiResponse<TestResult>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<TestResult>>(
      '/api/test',
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<TestResult>;
    }
    return {
      success: false,
      status: 500,
      message: '답안 제출 중 오류 발생',
      data: null,
      timestamp: new Date().toISOString(),
      path: '/api/test',
    };
  }
};
