import { useState } from 'react';
import {
  fetchTestPapers,
  createTestPaper,
  updateTestPaperTitle,
  deleteTestPaper,
} from '@/apis/testpaper/testpaper';
import {
  CreateTestPaperRequest,
  TestPaperListResponse,
} from '@/types/testpaper';

export function useTestPaper() {
  const [testPapers, setTestPapers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 시험지 전체 조회
  const getTestPapers = async (workBookId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res: TestPaperListResponse = await fetchTestPapers(workBookId);
      if (res.success && res.data) {
        setTestPapers(res.data);
      } else {
        setTestPapers([]);
      }
    } catch (err: any) {
      setError(err);
      setTestPapers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 시험지 생성
  const addTestPaper = async (data: CreateTestPaperRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await createTestPaper(data);
      if (res.success && res.data) {
        setTestPapers((prev) => [...prev, res.data]);
      }
      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 시험지명 수정
  const editTestPaperTitle = async (testPaperId: number, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await updateTestPaperTitle(testPaperId, title);
      if (res.success && res.data) {
        setTestPapers((prev) =>
          prev.map((paper) =>
            paper.testPaperId === testPaperId ? { ...paper, title } : paper
          )
        );
      }
      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 시험지 삭제
  const removeTestPaper = async (testPaperId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deleteTestPaper(testPaperId);
      if (res.success) {
        setTestPapers((prev) =>
          prev.filter((paper) => paper.workBookId !== testPaperId)
        );
      }
      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    testPapers,
    isLoading,
    error,
    getTestPapers,
    addTestPaper,
    editTestPaperTitle,
    removeTestPaper,
    setTestPapers, // 필요시 외부에서 직접 세팅 가능
  };
}
