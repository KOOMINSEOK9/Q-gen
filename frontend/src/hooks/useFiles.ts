// import { useState, useCallback } from 'react';
// import {
//   uploadDocument,
//   fetchDocumentsByWorkBook,
//   deleteDocument,
// } from '@/apis/document/document';
// import { FileInfo } from '@/types/document';

// export function useFile() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   // 파일 목록 조회
//   const getFiles = useCallback(async (workBookId: number) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const docs = await fetchDocumentsByWorkBook(workBookId);
//       return docs;
//     } catch (err: any) {
//       setError(err);
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 파일 업로드
//   const uploadFile = useCallback(async (file: File, workBookId: number) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await uploadDocument(file, workBookId);
//     } catch (err: any) {
//       setError(err);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // 파일 삭제
//   const deleteFile = useCallback(async (documentId: number) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await deleteDocument(documentId);
//     } catch (err: any) {
//       setError(err);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   return {
//     isLoading,
//     error,
//     getFiles,
//     uploadFile,
//     deleteFile,
//   };
// }
