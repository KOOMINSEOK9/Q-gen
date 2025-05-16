// src/hooks/useWorkBook.ts
import { useState } from 'react';
import { WorkBook } from '@/types/workbook';
import {
  getWorkBooks,
  createWorkBook,
  deleteWorkBook,
  updateWorkBook,
} from '@/apis/workbook/workbook';

interface UseWorkBookReturn {
  workbooks: WorkBook[];
  setWorkbooks: (workbooks: WorkBook[]) => void;
  isLoading: boolean;
  error: Error | null;
  fetchWorkBooks: () => Promise<void>;
  createNewWorkBook: (title: string) => Promise<void>;
  removeWorkBook: (workBookId: number) => Promise<void>;
  editWorkBook: (workBookId: number, title: string) => Promise<void>;
}

export const useWorkBook = (): UseWorkBookReturn => {
  const [workbooks, setWorkbooks] = useState<WorkBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 문제집 목록 조회
  const fetchWorkBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWorkBooks();
      setWorkbooks(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch workbooks')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 문제집 생성
  const createNewWorkBook = async (title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newWorkBook = await createWorkBook(title);
      setWorkbooks((prev) => [...prev, newWorkBook]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to create workbook')
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 문제집 삭제
  const removeWorkBook = async (workBookId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteWorkBook(workBookId);
      setWorkbooks((prev) => prev.filter((wb) => wb.workBookId !== workBookId));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to delete workbook')
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 문제집 수정
  const editWorkBook = async (workBookId: number, title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateWorkBook(workBookId, title);
      setWorkbooks((prev) =>
        prev.map((wb) => (wb.workBookId === workBookId ? { ...wb, title } : wb))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to update workbook')
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    workbooks,
    setWorkbooks,
    isLoading,
    error,
    fetchWorkBooks,
    createNewWorkBook,
    removeWorkBook,
    editWorkBook,
  };
};
