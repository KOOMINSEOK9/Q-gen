// import { useState, useCallback } from 'react';
// import {
//   uploadDocumentByWorkBookId,
//   fetchDocumentsByWorkBook,
//   deleteDocumentByDocumentId,
// } from '@/apis/document/document';
// import { DocumentInfo } from '@/types/document';

// export function useUpload() {
//   const [documents, setDocuments] = useState<DocumentInfo[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   // getDocuments를 useCallback으로 메모이제이션
//   const getDocuments = useCallback(async (workBookId: number) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const docs = await fetchDocumentsByWorkBook(workBookId);
//       setDocuments(docs);
//       return docs;
//     } catch (err: any) {
//       setError(err);
//       setDocuments([]);
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   }, []); // 의존성 없음

//   // handleUpload도 메모이제이션
//   const handleUpload = async (file: File, workBookId: number) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await uploadDocument(file, workBookId);
//       // const docs = await getDocuments(workBookId);
//       // setDocuments(docs);
//       // return docs;
//     } catch (err: any) {
//       setError(err);
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // handleDelete도 메모이제이션
//   const handleDelete = useCallback(
//     async (documentId: number) => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         await deleteDocument(documentId);
//         // await getDocuments(workBookId);
//       } catch (err: any) {
//         setError(err);
//         throw err;
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [getDocuments]
//   );

//   return {
//     documents,
//     isLoading,
//     error,
//     handleUpload,
//     getDocuments,
//     handleDelete,
//     setDocuments,
//   };
// }
