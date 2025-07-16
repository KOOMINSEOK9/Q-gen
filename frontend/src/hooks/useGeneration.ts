import { useState } from 'react';
import { generate } from '@/apis/generate/generate';
import { GenerateRequest, GenerateResponse } from '@/types/generate';
import { useTestPaperCreationStore } from '@/stores/testPaperCreationStore';

interface UseGenerationReturn {
  isLoading: boolean;
  error: string | null;
  generatePaper: (request: GenerateRequest) => Promise<GenerateResponse>;
}

export const useGeneration = (): UseGenerationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addCreatingTestPaper = useTestPaperCreationStore(
    (s) => s.addCreatingTestPaper
  );

  const generatePaper = async (request: GenerateRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await generate(request);
      if (response.success && response.data) {
        addCreatingTestPaper(response.data.testPaperId);
      } else if (!response.success) {
        setError(response.message);
      }
      return response;
    } catch (err) {
      const errorMessage = '시험지 생성 중 오류가 발생했습니다.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generatePaper,
  };
};
