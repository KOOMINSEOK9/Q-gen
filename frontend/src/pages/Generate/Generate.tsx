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
import NoDocumentWarningModal from '@/components/common/NoDocumentWarningModal/NoDocumentWarningModal';
import axiosInstance from '@/apis/axiosInstance';
import { fetchTestPapers } from '@/apis/testpaper/testpaper';
import { getWorkBooks } from '@/apis/workbook/workbook';
import { useWorkbookStore } from '@/stores/workbookStore';

const Generate = () => {
  const { workBookId } = useParams();
  const navigate = useNavigate();
  const numericWorkBookId = workBookId ? Number(workBookId) : undefined;

  // workbookStore에서 문제집 정보 가져오기
  const getCurrentWorkbookTitle = useWorkbookStore(
    (state) => state.getCurrentWorkbookTitle
  );
  const getLastNumber = useWorkbookStore((state) => state.getLastNumber);
  const updateLastNumber = useWorkbookStore((state) => state.updateLastNumber);
  const setCurrentWorkbookTitle = useWorkbookStore(
    (state) => state.setCurrentWorkbookTitle
  );

  // 초기 제목 설정 - store에서 문제집 제목과 마지막 숫자 가져오기
  const storedWorkbookTitle = numericWorkBookId
    ? getCurrentWorkbookTitle(numericWorkBookId)
    : null;
  const lastNumber = numericWorkBookId ? getLastNumber(numericWorkBookId) : 0;

  // 시험지 제목은 빈 문자열로 시작 (placeholder만 사용)
  const [testName, setTestName] = useState('');
  const [testTypes, setTestTypes] = useState<TestType[]>([
    { name: '객관식', count: 0 },
    { name: '주관식', count: 0 },
    { name: 'OX퀴즈', count: 0 },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [lastUploadedId, setLastUploadedId] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showNoDocumentWarning, setShowNoDocumentWarning] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 문제집 이름을 기반으로 한 플레이스홀더
  // 저장된 제목이 있으면 바로 사용, 없으면 기본값
  const [titlePlaceholder, setTitlePlaceholder] = useState(
    storedWorkbookTitle
      ? `${storedWorkbookTitle}${lastNumber + 1}`
      : '제목없는 시험지'
  );

  const totalProblems = useMemo(() => {
    return testTypes.reduce((sum, type) => sum + type.count, 0);
  }, [testTypes]);

  const { isLoading, generatePaper } = useGeneration();
  const { getDocuments, deleteDocument, uploadDocument } = useDocuments();
  const setGenerated = useGenerateStore((state) => state.setGenerated);

  // 문서 목록 조회
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

  // 문제집 및 시험지 정보 가져오기 - 페이지 진입 시 즉시 실행
  useEffect(() => {
    if (!numericWorkBookId) return;

    // 이미 로컬 스토리지에 저장된 제목이 있으면 시험지 목록만 가져오기
    const loadWorkbookInfo = async () => {
      try {
        // 문제집 정보가 없는 경우에만 정보 가져오기
        if (!storedWorkbookTitle) {
          // 문제집 목록 가져오기
          const workbooks = await getWorkBooks();

          // 현재 문제집 찾기
          const currentWorkbook = workbooks.find(
            (wb) => wb.workBookId === numericWorkBookId
          );

          if (currentWorkbook && currentWorkbook.title) {
            // 찾은 문제집 제목을 스토어에 저장
            setCurrentWorkbookTitle(numericWorkBookId, currentWorkbook.title);
          }
        }

        // 시험지 목록 가져오기
        const testPapersResponse = await fetchTestPapers(numericWorkBookId);
        const testpapers = testPapersResponse.data || [];

        if (testpapers.length > 0 && storedWorkbookTitle) {
          // 패턴 매칭으로 시험지 번호 찾기
          let maxNumber = 0;
          const pattern = new RegExp(`^${storedWorkbookTitle}(\\d+)$`);

          testpapers.forEach((paper: any) => {
            const match = paper.title.match(pattern);
            if (match && match[1]) {
              const num = parseInt(match[1], 10);
              if (num > maxNumber) {
                maxNumber = num;
              }
            }
          });

          // 마지막 번호를 스토어에 저장
          updateLastNumber(numericWorkBookId, maxNumber);

          // 다음 번호로 새 플레이스홀더 설정 (입력 필드는 빈 값 유지)
          const nextNumber = maxNumber + 1;
          const newTitle = `${storedWorkbookTitle}${nextNumber}`;
          setTitlePlaceholder(newTitle);
        }
      } catch (error) {
        console.error('문제집/시험지 정보 로드 실패:', error);
      }
    };

    loadWorkbookInfo();
    fetchDocuments();
  }, [
    numericWorkBookId,
    fetchDocuments,
    storedWorkbookTitle,
    updateLastNumber,
    setCurrentWorkbookTitle,
  ]);

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
      setSelectedDocumentIds((prev) =>
        prev.filter((docId) => docId !== Number(id))
      );
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
    if (selectedDocumentIds.length === 0) {
      setShowNoDocumentWarning(true);
      return;
    }

    if (!numericWorkBookId) {
      Swal.fire({
        icon: 'error',
        title: '문제집 ID가 없습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const validDocumentIds = selectedDocumentIds.filter((id) =>
      uploadedFiles.some((file) => Number(file.id) === id)
    );

    const finalTitle = testName || titlePlaceholder;

    // 시험지 생성 시 lastNumber를 1 증가시킴
    if (!testName && numericWorkBookId && storedWorkbookTitle) {
      const currentLastNumber = getLastNumber(numericWorkBookId);
      updateLastNumber(numericWorkBookId, currentLastNumber + 1);
    }

    const request = {
      workBookId: numericWorkBookId,
      title: finalTitle,
      choiceAns: testTypes.find((t) => t.name === '객관식')?.count || 0,
      shortAns: testTypes.find((t) => t.name === '주관식')?.count || 0,
      oxAns: testTypes.find((t) => t.name === 'OX퀴즈')?.count || 0,
      quantity: totalProblems,
      documentIds: validDocumentIds,
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

        <div className='w-full bg-white rounded-3xl shadow-sm p-6 md:col-span-2'>
          <div className='flex justify-start gap-2 items-end mb-5'>
            <h2 className='text-xl font-semibold'>시험지 이름</h2>
            <span className='text-lg text-gray-400'>{testName.length}/100</span>
          </div>
          <div className='border-b-1 border-gray-300 pb-2 transition-colors focus-within:border-[#754AFF]'>
            <input
              type='text'
              placeholder={titlePlaceholder}
              value={testName}
              onChange={handleTestNameChange}
              className='w-full bg-transparent border-none outline-none text-lg text-gray-800 placeholder-gray-400'
            />
          </div>
        </div>

        <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 '>
          <div className='flex md:col-span-2 p-6 bg-white rounded-3xl shadow-sm min-h-[80dvh]'>
            <FileUploader
              onFileUpload={handleFileUpload}
              onLinkSubmit={handleLinkSubmit}
              onTextSubmit={handleTextSubmit}
              className='md:col-span-2'
              setUploading={setUploading}
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
              uploading={uploading}
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

        <div className='flex w-full justify-center mt-8'>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button
              onClick={handleGenerate}
              variant='filled'
              className={`w-[40dvw] py-4 text-xl rounded-2xl font-semibold relative overflow-hidden
                ${totalProblems !== 0 && !isLoading ? 'btn-gradient-move text-white' : ''}
              `}
              disabled={totalProblems === 0 || isLoading}
            >
              {isLoading ? '생성 중...' : '시험지 생성하기'}
            </Button>
            {totalProblems === 0 && !isLoading && (
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
                  if (totalProblems === 0) {
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
      <NoDocumentWarningModal
        isOpen={showNoDocumentWarning}
        onClose={() => setShowNoDocumentWarning(false)}
      />
    </div>
  );
};

export default Generate;
