import { useState, useCallback } from 'react';
import {
  uploadDocumentByWorkBookId,
  fetchDocumentsByWorkBook,
  deleteDocumentByDocumentId,
  fetchDocumentByDocumentId,
  downloadDocumentByDocumentId,
  convertTextToTxt as apiConvertTextToTxt,
  convertUrlToTxt as apiConvertUrlToTxt,
} from '@/apis/document/document';
import { DocumentInfo } from '@/types/document';
export function useDocuments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 문서 목록 조회
  const getDocuments = useCallback(async (workBookId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const docs = await fetchDocumentsByWorkBook(workBookId);
      return docs;
    } catch (err: any) {
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 문서 업로드
  const uploadDocument = useCallback(async (file: File, workBookId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await uploadDocumentByWorkBookId(file, workBookId);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 문서 삭제
  const deleteDocument = useCallback(async (documentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteDocumentByDocumentId(documentId);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 문서 상세 조회
  const getDocument = useCallback(async (documentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const doc = await fetchDocumentByDocumentId(documentId);
      return doc;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 텍스트 입력 txt파일 변환
  const convertTextToTxt = useCallback(
    async (workBookId: number, text: string): Promise<DocumentInfo> => {
      setIsLoading(true);
      setError(null);
      try {
        const doc = await apiConvertTextToTxt(workBookId, text);
        return doc;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // url txt파일 변환
  const convertUrlToTxt = useCallback(
    async (workBookId: number, url: string): Promise<DocumentInfo> => {
      setIsLoading(true);
      setError(null);
      try {
        const doc = await apiConvertUrlToTxt(workBookId, url);
        return doc;
      } catch (err: any) {
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 파일 다운로드
  const downloadDocument = useCallback(async (documentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const blob = await downloadDocumentByDocumentId(documentId);
      return blob;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getDocuments,
    uploadDocument,
    deleteDocument,
    getDocument,
    convertTextToTxt,
    convertUrlToTxt,
    downloadDocument,
  };
}
