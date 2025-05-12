import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import UploadedList from '@/components/upload/UploadedList/UploadedList';
import FileUploader from '@/components/upload/FileUpload/FileUploader';
import { TestType } from '@/types/generate';
import { UploadedFile } from '@/types/document';
import { useGeneration } from '@/hooks/useGeneration';
import { useGenerateStore } from '@/stores/generateStore';
import ProblemTypeSelector from './ProblemTypeSelector';
import GradientTitle from '@/components/common/GradientTitle/GradientTitle';
import { useDocuments } from '@/hooks/useDocument';

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
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const totalProblems = useMemo(() => {
    return testTypes.reduce((sum, type) => sum + type.count, 0);
  }, [testTypes]);

  const { isLoading, generatePaper } = useGeneration();
  // const { isLoading: isUploading, handleUpload, handleDelete } = useUpload();
  const {
    getDocuments,
    deleteDocument,
    uploadDocument,
    // isLoading: isDocumentLoading,
  } = useDocuments();
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
      prev.map((type) => ({
        ...type,
        count:
          type.name === typeName
            ? type.count === 0
              ? totalProblems >= 30
                ? 0
                : 1
              : 0
            : type.count,
      }))
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
    } catch (err) {
      console.error('파일 업로드 실패:', err);
      alert('파일 업로드에 실패했습니다.');
    }
  };

  const handleLinkSubmit = (url: string) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      title: url,
      type: 'URL',
    };
    setUploadedFiles((prev) => [...prev, newFile]);
  };

  const handleTextSubmit = (text: string) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      title: '직접 입력한 텍스트',
      type: 'Text',
    };
    setUploadedFiles((prev) => [...prev, newFile]);
  };

  const handleFileDelete = async (id: string) => {
    if (!numericWorkBookId) return;

    try {
      await deleteDocument(Number(id));
      await fetchDocuments();
    } catch (err) {
      console.error('파일 삭제 실패:', err);
      alert('파일 삭제에 실패했습니다.');
    }
  };

  const handleTestNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length > 100) {
      alert('시험지 이름은 100자를 초과할 수 없어요🥲');
      return;
    }
    setTestName(newValue);
  };

  const handleGenerate = async () => {
    if (!numericWorkBookId) {
      alert('문제집 ID가 없습니다.');
      return;
    }

    const request = {
      workBookId: numericWorkBookId,
      title: testName || '제목없는 시험지',
      choiceAns: testTypes.find((t) => t.name === '객관식')?.count || 0,
      shortAns: testTypes.find((t) => t.name === '주관식')?.count || 0,
      oxAns: testTypes.find((t) => t.name === 'OX퀴즈')?.count || 0,
      // wordAns: testTypes.find((t) => t.name === '서술형')?.count || 0,
      quantity: totalProblems,
    };

    try {
      const response = await generatePaper(request);
      if (response.success && response.data) {
        setGenerated(response.data);
        navigate(`/list/${numericWorkBookId}`);
      }
    } catch (err) {
      console.error('시험지 생성 실패:', err);
    }
  };

  // 문서 선택 핸들러
  const handleDocumentSelect = (id: string) => {
    setSelectedDocumentIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((docId) => docId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div>
      <div className='flex flex-col items-start justify-start min-h-screen w-full mx-auto gap-6'>
        {/* Title Section + Button */}
        <div className='flex justify-between items-center w-full'>
          <GradientTitle highlight='시험지' after='생성하기' />
          <div className='flex gap-3'>
            <Button
              variant='outlined'
              className='px-8 py-3 text-lg font-semibold relative overflow-hidden'
              onClick={() => navigate(`/list/${numericWorkBookId}`)}
            >
              취소
            </Button>
            <Button
              onClick={handleGenerate}
              variant='filled'
              className={`px-8 py-3 text-lg font-semibold relative overflow-hidden
              ${totalProblems !== 0 && uploadedFiles.length !== 0 && !isLoading ? 'btn-gradient-move text-white' : ''}
            `}
              disabled={
                totalProblems === 0 || uploadedFiles.length === 0 || isLoading
              }
            >
              {isLoading ? '생성 중...' : '시험지 생성하기'}
            </Button>
          </div>
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
        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 '>
          <div className='flex md:col-span-2 p-6 bg-white rounded-3xl shadow-sm'>
            <FileUploader
              onFileUpload={handleFileUpload}
              onLinkSubmit={handleLinkSubmit}
              onTextSubmit={handleTextSubmit}
              className='md:col-span-2'
              // workBookId={numericWorkBookId ?? 0}
            />
          </div>
          <div className='flex flex-col gap-6'>
            <UploadedList
              files={uploadedFiles}
              maxFiles={10}
              onDelete={handleFileDelete}
              className='md:col-span-1'
              showAddButton={false}
              selectedIds={selectedDocumentIds}
              onSelect={handleDocumentSelect}
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
      </div>
    </div>
  );
};

export default Generate;
