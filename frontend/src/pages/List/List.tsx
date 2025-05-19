// src/pages/MainContent.tsx

import WorkBookList from './WorkBookList';
// import WorkBookAddModal from '@/components/workbook/WorkBookAddModal/WorkBookAddModal';
import { useEffect, useState } from 'react';
import UploadedList from '@/components/upload/UploadedList/UploadedList';
import TestPaperList from './TestPaperList';
import IconBox from '@/components/common/IconBox/IconBox';
import Button from '@/components/common/Button/Button';
import { useWorkBook } from '@/hooks/useWorkBooks';
import UploadModal from '@/components/upload/UploadModal/UploadModal';
import { UploadedFile, DocumentInfo } from '@/types/document';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestPaper } from '@/hooks/useTestPaper';
import { useDocuments } from '@/hooks/useDocument';
import { TestPaper } from '@/types/testpaper';
import PdfModal from '@/components/testpaper/PdfModal';
import QuizStartModal from '@/components/testpaper/QuizStartModal';
import WorkBookTitleModal from '@/components/workbook/WorkBookTitleModal/WorkBookTitleModal';
import { useTestPaperCreationStore } from '@/stores/testPaperCreationStore';
import { connectSSE } from '@/utils/sse';
import { useUserStore } from '@/stores/userStore';
import { convertToPdf } from '@/apis/testpaper/testpaper';
import { downloadPdf } from '@/utils/file';
import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';

export default function List() {
  const { workBookId } = useParams(); // URL 파라미터에서 workBookId 추출
  const numericWorkBookId = workBookId ? Number(workBookId) : null;
  const userId = useUserStore((s) => s.userId);
  const isLoggedIn = userId !== null;
  const navigate = useNavigate();
  const { userName } = useAuth(); // useAuth 훅 사용

  // 커스텀 훅 사용
  const {
    workbooks,
    // setWorkbooks,
    isLoading,
    error,
    fetchWorkBooks,
    createNewWorkBook,
    editWorkBook,
    removeWorkBook,
  } = useWorkBook();

  const {
    testPapers,
    isLoading: papersLoading,
    error: papersError,
    getTestPapers,
    removeTestPaper,
  } = useTestPaper();

  const {
    // documents,
    getDocuments,
    deleteDocument,
    uploadDocument,
    // isLoading: uploadLoading,
    // error: uploadError,
  } = useDocuments();

  // 기타 상태
  const [selectedWorkbook, setSelectedWorkbook] = useState<number | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // files 상태를 상위에서 관리
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<TestPaper | null>(null);
  const [isQuizStartModalOpen, setIsQuizStartModalOpen] = useState(false);
  const [selectedPaperForQuiz, setSelectedPaperForQuiz] =
    useState<TestPaper | null>(null);

  const [miniModalOpen, setMiniModalOpen] = useState(false);
  const [selectedWorkBookId, setSelectedWorkBookId] = useState<number | null>(
    null
  );

  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [titleModalMode, setTitleModalMode] = useState<'add' | 'edit'>('add');
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [editTargetTitle, setEditTargetTitle] = useState('');

  const creatingTestPaperIds = useTestPaperCreationStore(
    (s) => s.creatingTestPaperIds
  );

  // 로그인 체크
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 문제집 목록 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchWorkBooks();
    }
  }, [isLoggedIn]);

  // 선택된 워크북 정보
  const selectedWorkbookData =
    workbooks && Array.isArray(workbooks)
      ? workbooks.find((wb) => wb.workBookId === numericWorkBookId)
      : undefined;

  // 수정 모드 시작
  const handleStartEdit = () => {
    setEditingTitle(selectedWorkbookData?.title || '');
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingTitle('');
  };

  // 수정 완료
  const handleSubmitEdit = async () => {
    if (editingTitle.trim() && selectedWorkbook) {
      await editWorkBook(selectedWorkbook, editingTitle.trim());
    }
    setIsEditing(false);
    setEditingTitle('');
  };

  // 문제집 클릭
  const handleWorkBookClick = (id: number) => {
    setSelectedWorkbook(id);
  };

  // 문제집 목록으로 돌아가기
  const handleBackToWorkbooks = () => {
    setSelectedWorkbook(null);
    setIsEditing(false);
    setEditingTitle('');
    navigate('/list');
  };

  // 파일 추가 함수
  const handleFileUpload = async (file: File) => {
    if (!numericWorkBookId) return;
    try {
      await uploadDocument(file, numericWorkBookId);
      // 업로드 후 서버에서 최신 파일 목록을 받아와서 상태 갱신
      const docs = await getDocuments(numericWorkBookId);
      setFiles(
        docs.map((doc) => ({
          id: String(doc.documentId),
          title: doc.documentName,
          type: doc.documentType,
        }))
      );
      setIsUploadModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '파일 업로드에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // 링크 추가 함수 (DocumentInfo 기반)
  const handleLinkSubmit = (result: DocumentInfo) => {
    setFiles((prev) => [
      ...prev,
      {
        id: result.documentId.toString(),
        title: result.documentName,
        type: result.documentType,
      },
    ]);
    setIsUploadModalOpen(false);
  };

  // 텍스트 추가 함수 (DocumentInfo 기반)
  const handleTextSubmit = (result: DocumentInfo) => {
    setFiles((prev) => [
      ...prev,
      {
        id: result.documentId.toString(),
        title: result.documentName,
        type: result.documentType,
      },
    ]);
    setIsUploadModalOpen(false);
  };

  // 파일 삭제 함수
  const handleDelete = async (id: string) => {
    if (!numericWorkBookId) return;
    try {
      // 서버에서 파일 삭제
      await deleteDocument(Number(id));
      // 삭제 후 최신 파일 목록을 다시 불러와서 files 상태 갱신
      const docs = await getDocuments(numericWorkBookId);
      setFiles(
        docs.map((doc) => ({
          id: String(doc.documentId),
          title: doc.documentName,
          type: doc.documentType,
        }))
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '파일 삭제에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // workBookId가 있을 때 시험지 리스트 조회
  useEffect(() => {
    if (numericWorkBookId) {
      setFiles([]); // 초기화
      getTestPapers(numericWorkBookId);
      getDocuments(numericWorkBookId).then((docs) => {
        console.log('조회된 시험지 :: ', docs);
        setFiles(
          docs.map((doc) => ({
            id: String(doc.documentId),
            title: doc.documentName,
            type: doc.documentType,
            // 필요하다면 추가 필드도 넣기
          }))
        );
      });
    }
  }, [numericWorkBookId]);

  // PDF 버튼 클릭 핸들러
  const handlePdfClick = (testPaperId: string | number) => {
    const paper = testPapers.find((p) => p.testPaperId === testPaperId);
    if (paper) {
      setSelectedPaper(paper);
      setIsPdfModalOpen(true);
    }
  };

  // 퀴즈 시작 핸들러
  const handleQuizStart = (testPaperId: string | number) => {
    navigate(`/quiz/${testPaperId}`);
  };

  // 이력 확인 핸들러
  const handleHistoryClick = (testPaperId: string | number) => {
    navigate(`/note/${numericWorkBookId}/${testPaperId}`);
  };

  // 퀴즈 모드 시작 핸들러
  const handleQuizModeStart = (
    mode: 'practice' | 'real',
    timer?: { min: number; sec: number }
  ) => {
    // TODO: 선택된 모드와 타이머로 퀴즈 페이지로 이동
    console.log('Quiz mode:', mode, 'Timer:', timer);
    setIsQuizStartModalOpen(false);
  };

  // 시험지 생성 페이지 이동 핸들러
  const handleGenerateClick = () => {
    if (!numericWorkBookId) {
      Swal.fire({
        icon: 'warning',
        title: '문제집을 선택해주세요.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    navigate(`/generate/${numericWorkBookId}`);
  };

  // List.tsx에 handleDeleteTestPaper 함수 추가
  const handleDeleteTestPaper = async (testPaperId: string | number) => {
    try {
      await removeTestPaper(Number(testPaperId)); // string이 들어올 경우를 대비해 Number로 변환
      // 삭제 후 시험지 목록 새로고침
      if (numericWorkBookId) {
        await getTestPapers(numericWorkBookId);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '시험지 삭제에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // 문제집 삭제
  const handleWorkBookDelete = async (workBookId: string) => {
    if (!workBookId || !isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!window.confirm('이 문제집을 삭제하시겠습니까?')) return;
    try {
      await removeWorkBook(Number(workBookId));
      await fetchWorkBooks();
      setMiniModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '문제집 삭제에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // 문제집 추가 버튼 클릭 시
  const handleOpenAddModal = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setTitleModalMode('add');
    setEditTargetId(null);
    setEditTargetTitle('');
    setIsTitleModalOpen(true);
  };

  // 문제집 이름 수정 버튼 클릭 시
  const handleOpenEditModal = (id: string, title: string) => {
    setTitleModalMode('edit');
    setEditTargetId(Number(id));
    setEditTargetTitle(title);
    setIsTitleModalOpen(true);
  };

  // 모달에서 submit 시
  const handleTitleModalSubmit = async (title: string) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (titleModalMode === 'add') {
      setIsTitleModalOpen(false);
      await createNewWorkBook(title);
      await fetchWorkBooks();
    } else if (titleModalMode === 'edit' && editTargetId) {
      await editWorkBook(editTargetId, title);
      await fetchWorkBooks();
    }
    setIsTitleModalOpen(false);
  };

  // SSE 연결
  useEffect(() => {
    if (isLoggedIn && userId) {
      const eventSource = connectSSE(userId);
      return () => {
        eventSource?.close();
      };
    }
  }, [isLoggedIn, userId]);

  // PDF 다운로드 핸들러 추가
  const handlePdfDownload = async (option: '문제만' | '정답/해설포함') => {
    if (!selectedPaper) return;

    try {
      const blob = await convertToPdf(
        selectedPaper.testPaperId,
        option === '정답/해설포함'
      );
      downloadPdf(blob, `${selectedPaper.title}.pdf`);
      setIsPdfModalOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'PDF 변환에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className='pb-8 flex flex-col gap-0'>
      {/* 인사 및 알림 카드 */}
      {/* <GradientTitle
        highlight='문제집'
        after='목록'
        className='text-4xl mb-6'
      ></GradientTitle> */}
      <div className='flex gap-0 py-6'>
        <div className='w-26 h-26 mt-6 ml-6 animate-dolphin'>
          <img src='/images/dolpin-with-tablet.png' alt='돌고래 사진' />
        </div>
        <div className='flex flex-col h-[100px] items-start justify-center bg-white rounded-2xl shadow px-6 min-w-[540px] ml-[1%] relative cursor-default animate-speech-bubble'>
          <span className='text-2xl font-semibold'>
            안녕하세요!{' '}
            <strong className='bg-gradient-to-r from-[#6D6DFF] to-[#B16DFF] text-transparent bg-clip-text p-1'>
              {userName || 'User'}
            </strong>
            님
          </span>
          <span className='text-2xl font-semibold'>
            오늘도{' '}
            <strong className='bg-gradient-to-r from-[#6D6DFF] to-[#B16DFF] text-transparent bg-clip-text '>
              Q-gen
            </strong>{' '}
            에서 효율적인 공부를 시작해볼까요!
          </span>
          {/* 말풍선 꼭지 */}
          {/* <div className='absolute -bottom-3 left-8 w-6 h-6 bg-white transform rotate-45 shadow-[2px_2px_2px_rgba(0,0,0,0.1)]'></div> */}
        </div>
      </div>
      {/* <section className='max-w-[600px] '>
        <div className='bg-white rounded-2xl shadow p-6 flex items-center gap-4 '>
          <div className='p-3 w-24 h-26 bg-gray-100 rounded-full flex items-center justify-center'>
            <img src='src/assets/images/dolpin-with-tablet.png' alt='' />
          </div>
          <div className='flex-1'>
            <div className='font-medium mb-1'>
              '정보처리기사 문제집'을 푼지 '3' 일이 지났어요.
            </div>
            <div className='text-gray-500 text-sm mb-2'>
              곧 잊어버리기 전에 함께 복습하러 가볼까요?
            </div>
            <Button variant='filled' className='px-3 py-2 text-sm'>
              문제 풀기
            </Button>
          </div>
        </div>
      </section> */}

      {/* 문제집 & 자료 업로드 */}
      <section className='flex gap-8'>
        {/* 문제집 리스트 */}
        <div className='flex-1 flex flex-col gap-0 h-full'>
          {/* 제목 파트 */}
          <div className='flex justify-between pt-4 pb-3 items-center'>
            <div className='flex items-center gap-2 h-[40px]'>
              <button
                onClick={handleBackToWorkbooks}
                className='cursor-pointer text-2xl font-semibold hover:text-purple-600 transition-colors'
              >
                문제집 목록
              </button>
              {!numericWorkBookId && (
                <IconBox
                  className='cursor-pointer'
                  name='plusCircle'
                  size={22}
                  onClick={handleOpenAddModal}
                />
              )}
              {numericWorkBookId && (
                <>
                  <IconBox
                    className='text-gray-400'
                    name='chevronDown'
                    rotate={-90}
                  ></IconBox>
                  {isEditing ? (
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-2 '>
                        <span
                          className='invisible whitespace-pre absolute text-2xl font-semibold'
                          aria-hidden='true'
                        >
                          {editingTitle}
                        </span>
                        <input
                          type='text'
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSubmitEdit();
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          className='w-full min-w-[200px] border-0 border-b-2 border-gray-300 focus:border-purple-500 focus:ring-0 focus:outline-none rounded-none px-0 py-0 text-2xl font-semibold bg-transparent'
                          autoFocus
                        />
                        <IconBox
                          className=' cursor-pointer'
                          name='check'
                          size={20}
                          onClick={handleSubmitEdit}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={handleStartEdit}
                      className='group flex items-center cursor-pointer'
                    >
                      {selectedWorkbookData ? (
                        <span className='text-2xl font-semibold border-b-2 border-transparent group-hover:border-gray-300'>
                          {selectedWorkbookData.title}
                        </span>
                      ) : (
                        <div>선택된 문제집이 없습니다.</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className='flex items-center justify-between gap-3'>
              {numericWorkBookId && (
                <div className='flex gap-2'>
                  <Button
                    variant='outlined'
                    className=''
                    onClick={() => handleHistoryClick(numericWorkBookId)}
                    disabled={testPapers.length === 0}
                    title={
                      testPapers.length === 0
                        ? '생성된 시험지가 없을 때는 문제 노트를 사용할 수 없습니다.'
                        : ''
                    }
                  >
                    문제 노트
                  </Button>
                  <Button
                    variant='filled'
                    className=''
                    onClick={handleGenerateClick}
                  >
                    시험지 생성하기 ✨
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className='flex gap-5'>
            <div className='flex-4 relative'>
              {/* 기존 리스트는 항상 렌더링 */}
              {numericWorkBookId ? (
                <TestPaperList
                  workBookId={numericWorkBookId || 0}
                  papers={testPapers.map((paper) => {
                    const isCreating = creatingTestPaperIds.includes(
                      paper.testPaperId
                    );
                    return {
                      ...paper,
                      isCreating,
                    };
                  })}
                  onAddClick={() => navigate(`/generate/${numericWorkBookId}`)}
                  onPdfClick={handlePdfClick}
                  onSolveClick={handleQuizStart}
                  onHistoryClick={handleHistoryClick}
                  onDelete={handleDeleteTestPaper}
                />
              ) : (
                <WorkBookList
                  workbooks={workbooks}
                  onWorkBookClick={(id) => handleWorkBookClick(Number(id))}
                  onAddClick={handleOpenAddModal}
                  onWorkBookDelete={handleWorkBookDelete}
                  onWorkBookEdit={(id) => {
                    const target = Array.isArray(workbooks)
                      ? workbooks.find((wb) => String(wb.workBookId) === id)
                      : undefined;
                    handleOpenEditModal(id, target?.title ?? '');
                  }}
                />
              )}

              {/* 로딩/에러 오버레이 */}
              {(isLoading || papersLoading || error || papersError) && (
                <div className='absolute inset-0 bg-white/60 flex flex-col items-center justify-center z-10'>
                  {(isLoading || papersLoading) && (
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4'></div>
                  )}
                  {error && (
                    <div className='text-red-500 text-lg mb-2'>
                      {error.message}
                    </div>
                  )}
                  {papersError && (
                    <div className='text-red-500 text-lg'>
                      {papersError.message}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* 자료 업로드 - selectedWorkbook이 있을 때만 표시 */}
            {numericWorkBookId && (
              <aside className='flex flex-2 shrink-0 h-full'>
                <UploadedList
                  files={files}
                  maxFiles={30}
                  onDelete={handleDelete}
                  onClick={() => setIsUploadModalOpen(true)}
                  className='h-full'
                />
                <UploadModal
                  isOpen={isUploadModalOpen}
                  onClose={() => setIsUploadModalOpen(false)}
                  onFileUpload={handleFileUpload}
                  onLinkSubmit={handleLinkSubmit}
                  onTextSubmit={handleTextSubmit}
                  workBookId={numericWorkBookId || 0}
                />
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* 모달 모음  */}
      <WorkBookTitleModal
        isOpen={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        onSubmit={handleTitleModalSubmit}
        defaultTitle={editTargetTitle}
        titleText={
          titleModalMode === 'add' ? '새 문제집 만들기' : '문제집 이름 수정'
        }
        submitText={titleModalMode === 'add' ? '만들기' : '수정하기'}
      />

      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onDownload={handlePdfDownload}
      />

      <QuizStartModal
        isOpen={isQuizStartModalOpen}
        onClose={() => setIsQuizStartModalOpen(false)}
        onStart={handleQuizModeStart}
      />
    </div>
  );
}
