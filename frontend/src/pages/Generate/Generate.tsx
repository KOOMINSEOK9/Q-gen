import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import UploadedList from '@/components/upload/UploadedList/UploadedList';
import FileUploader from '@/components/upload/FileUpload/FileUploader';
import { TestType } from '@/types/generate';
import { UploadedFile, DocumentInfo } from '@/types/document';
import { useGeneration } from '@/hooks/useGeneration';
import { useGenerateStore } from '@/stores/generateStore';
import ProblemTypeSelector from './TestTypeSelector';
import GradientTitle from '@/components/common/GradientTitle/GradientTitle';
import { useDocuments } from '@/hooks/useDocument';
import Swal from 'sweetalert2';

const Generate = () => {
  const { workBookId } = useParams();
  const navigate = useNavigate();
  const numericWorkBookId = workBookId ? Number(workBookId) : undefined;

  const [testName, setTestName] = useState('');
  const [testTypes, setTestTypes] = useState<TestType[]>([
    { name: '객관식', count: 0 },
    { name: '주관식', count: 0 },
    { name: 'OX퀴즈', count: 0 },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [lastUploadedId, setLastUploadedId] = useState<string | null>(null);

  const totalProblems = useMemo(() => {
    return testTypes.reduce((sum, type) => sum + type.count, 0);
  }, [testTypes]);

  const { isLoading, generatePaper } = useGeneration();
  const { getDocuments, deleteDocument, uploadDocument } = useDocuments();
  const setGenerated = useGenerateStore((state) => state.setGenerated);

  const fetchDocuments = useCallback(async () => {
    if (numericWorkBookId) {
      try {
        const docs = await getDocuments(numericWorkBookId);
        const convertedFiles: UploadedFile[] = docs.map((doc) => ({
          id: doc.documentId.toString(),
          title: doc.documentName,
          type: doc.documentType,
        }));
        setUploadedFiles(convertedFiles);
      } catch (err) {
        console.error('파일 목록 조회 실패:', err);
      }
    }
  }, [numericWorkBookId, getDocuments]);

  // 컴포넌트 마운트 시 파일 목록 조회
  useEffect(() => {
    fetchDocuments();
  }, [numericWorkBookId]); // workBookId가 변경될 때만 실행

  const handleTypeClick = (typeName: string) => {
    setTestTypes((prev) =>
      prev.map((type) =>
        type.name === typeName
          ? type.count === 0
            ? { ...type, count: totalProblems < 30 ? 1 : 0 }
            : { ...type, count: 0 }
          : type
      )
    );
  };

  const handleCountChange = (typeName: string, newCount: number) => {
    if (newCount < 0) return;
    if (
      totalProblems -
        testTypes.find((t) => t.name === typeName)!.count +
        newCount >
      30
    )
      return;

    setTestTypes((prev) =>
      prev.map((type) => ({
        ...type,
        count: type.name === typeName ? newCount : type.count,
      }))
    );
  };

  const handleFileUpload = async (file: File) => {
    if (!numericWorkBookId) return;

    try {
      await uploadDocument(file, numericWorkBookId);
      await fetchDocuments();

      // 파일 목록이 최신화된 후, 마지막 파일을 자동 선택
      setUploadedFiles((files) => {
        if (files.length === 0) return files;
        const lastFile = files[files.length - 1];
        setLastUploadedId(lastFile.id);
        setTimeout(() => setLastUploadedId(null), 1000);
        setSelectedDocumentIds((prev) =>
          prev.includes(Number(lastFile.id))
            ? prev
            : [...prev, Number(lastFile.id)]
        );
        return files;
      });
    } catch (err) {
      console.error('파일 업로드 실패:', err);
      Swal.fire({
        icon: 'error',
        title: '파일 업로드에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleLinkSubmit = (result: DocumentInfo) => {
    setUploadedFiles((prev) => {
      setLastUploadedId(result.documentId.toString());
      setTimeout(() => setLastUploadedId(null), 1000);
      return [
        ...prev,
        {
          id: result.documentId.toString(),
          title: result.documentName,
          type: result.documentType,
        },
      ];
    });
    setSelectedDocumentIds((prev) =>
      prev.includes(Number(result.documentId))
        ? prev
        : [...prev, Number(result.documentId)]
    );
  };

  const handleTextSubmit = (result: DocumentInfo) => {
    setUploadedFiles((prev) => {
      setLastUploadedId(result.documentId.toString());
      setTimeout(() => setLastUploadedId(null), 1000);
      return [
        ...prev,
        {
          id: result.documentId.toString(),
          title: result.documentName,
          type: result.documentType,
        },
      ];
    });
    setSelectedDocumentIds((prev) =>
      prev.includes(Number(result.documentId))
        ? prev
        : [...prev, Number(result.documentId)]
    );
  };

  const handleFileDelete = async (id: string) => {
    if (!numericWorkBookId) return;

    try {
      await deleteDocument(Number(id));
      await fetchDocuments();
    } catch (err) {
      console.error('파일 삭제 실패:', err);
      Swal.fire({
        icon: 'error',
        title: '파일 삭제에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleTestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 100) {
      Swal.fire({
        icon: 'warning',
        title: '시험지 이름은 100자를 초과할 수 없습니다',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    setTestName(newValue);
  };

  const handleGenerate = async () => {
    if (!numericWorkBookId) {
      Swal.fire({
        icon: 'error',
        title: '문제집 ID가 없습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const request = {
      workBookId: numericWorkBookId,
      title: testName || '제목없는 시험지',
      choiceAns: testTypes.find((t) => t.name === '객관식')?.count || 0,
      shortAns: testTypes.find((t) => t.name === '주관식')?.count || 0,
      oxAns: testTypes.find((t) => t.name === 'OX퀴즈')?.count || 0,
      quantity: totalProblems,
      documentIds: selectedDocumentIds.map(Number),
    };

    try {
      const response = await generatePaper(request);
      if (response.success && response.data) {
        setGenerated(response.data);
        navigate(`/list/${numericWorkBookId}`);
      }
    } catch (err) {
      console.error('시험지 생성 실패:', err);
      Swal.fire({
        icon: 'error',
        title: '문제 생성 조건을 모두 충족해주세요.',
      });
    }
  };

  // 문서 선택 핸들러
  const handleDocumentSelect = (id: string) => {
    setSelectedDocumentIds((prev) => {
      if (prev.includes(Number(id))) {
        return prev.filter((docId) => docId !== Number(id));
      } else {
        return [...prev, Number(id)];
      }
    });
  };

  return (
    <div>
      <div className='flex flex-col items-start justify-start min-h-screen w-full mx-auto gap-4'>
        {/* Title Section */}
        <div className='flex justify-between items-center w-full'>
          <GradientTitle highlight='시험지' after='생성하기' />
          <Button
            variant='outlined'
            className='px-10 py-2 text-lg font-semibold relative overflow-hidden'
            onClick={() => navigate(`/list/${numericWorkBookId}`)}
          >
            취소
          </Button>
        </div>

        {/* Test Name Input Section */}
        <div className='w-full bg-white rounded-3xl shadow-sm p-6 md:col-span-2'>
          <div className='flex justify-start gap-2 items-end mb-5'>
            <h2 className='text-xl font-semibold'>시험지 이름</h2>
            <span className='text-lg text-gray-400'>{testName.length}/100</span>
          </div>
          <div className='border-b-1 border-gray-300 pb-2 transition-colors focus-within:border-[#754AFF]'>
            <input
              type='text'
              placeholder='제목없는 시험지'
              value={testName}
              onChange={handleTestNameChange}
              className='w-full bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-400'
            />
          </div>
        </div>

        {/* File Upload and List Section */}
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 '>
          <div className='flex md:col-span-2 p-6 bg-white rounded-3xl shadow-sm min-h-[80dvh]'>
            <FileUploader
              onFileUpload={handleFileUpload}
              onLinkSubmit={handleLinkSubmit}
              onTextSubmit={handleTextSubmit}
              className='md:col-span-2'
            />
          </div>
          <div className='flex flex-col gap-4'>
            <UploadedList
              files={uploadedFiles}
              maxFiles={30}
              onDelete={handleFileDelete}
              className='md:col-span-1'
              showAddButton={false}
              selectedIds={selectedDocumentIds.map(String)}
              onSelect={handleDocumentSelect}
              lastUploadedId={lastUploadedId}
            />
            <ProblemTypeSelector
              testTypes={testTypes}
              totalProblems={totalProblems}
              onTypeClick={handleTypeClick}
              onCountChange={handleCountChange}
              className='md:col-span-1'
            />
          </div>
        </div>

        {/* 버튼을 여기로 이동 */}
        <div className='flex w-full justify-center mt-8'>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button
              onClick={handleGenerate}
              variant='filled'
              className={`w-[40dvw] py-4 text-xl rounded-2xl font-semibold relative overflow-hidden
                ${totalProblems !== 0 && selectedDocumentIds.length !== 0 && !isLoading ? 'btn-gradient-move text-white' : ''}
              `}
              disabled={
                totalProblems === 0 ||
                selectedDocumentIds.length === 0 ||
                isLoading
              }
            >
              {isLoading ? '생성 중...' : '시험지 생성하기'}
            </Button>
            {(totalProblems === 0 || selectedDocumentIds.length === 0) &&
              !isLoading && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    cursor: 'not-allowed',
                    zIndex: 10,
                  }}
                  onClick={() => {
                    if (selectedDocumentIds.length === 0) {
                      Swal.fire({
                        icon: 'warning',
                        title: '자료를 업로드하여 선택해주세요.',
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    } else if (totalProblems === 0) {
                      Swal.fire({
                        icon: 'warning',
                        title: '문제 유형을 선택해주세요.',
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }
                  }}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
