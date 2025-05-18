// src/components/UploadedList/UploadedList.tsx
import { twMerge } from 'tailwind-merge';
import IconBox from '../../common/IconBox/IconBox';
import Button from '@/components/common/Button/Button';
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocument';
import UploadedListDetailModal from './UploadedDetailModal';
import PDFPreviewModal from './PDFPreviewModal';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import mammoth from 'mammoth';

interface UploadedFile {
  id: string;
  title: string;
  type: string;
}

interface UploadedListProps {
  /** 업로드된 파일 목록 */
  files: UploadedFile[];
  /** 전체 업로드 가능한 파일 수 */
  maxFiles?: number;
  onDelete?: (id: string) => void;
  /** 추가 클래스명 */
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  /** 자료 추가 버튼 표시 여부 */
  showAddButton?: boolean;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
}

function UploadedList({
  files,
  maxFiles = 10,
  onDelete,
  className,
  isLoading = false,
  onClick,
  showAddButton = true,
  selectedIds = [],
  onSelect,
}: UploadedListProps) {
  // files가 null이거나 undefined일 경우를 대비해 기본값 처리
  const safeFiles = files ?? [];
  const { getDocument, downloadDocument } = useDocuments();
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [docxPreviewOpen, setDocxPreviewOpen] = useState(false);
  const [docxFileName, setDocxFileName] = useState<string>('');

  // 파일 상세 조회 핸들러
  const handleDetailOpen = async (file: UploadedFile) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const doc = await getDocument(Number(file.id));
      setDetailData(doc);
    } catch (e) {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownloadFromPreview = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.setAttribute('download', pdfFileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const handleClosePreview = () => {
    setPdfPreviewOpen(false);
    if (pdfBlobUrl) {
      window.URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  // 파일 미리보기 핸들러 (PDF, DOCX)
  const handlePreviewDocument = async (
    file: UploadedFile,
    fileType: 'pdf' | 'docx'
  ) => {
    if (fileType === 'docx') {
      try {
        const blob = await downloadDocument(Number(file.id));
        const fileObj = new File([blob], file.title, {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        const reader = new FileReader();
        reader.onload = async function (event) {
          const arrayBuffer = event.target?.result;
          if (arrayBuffer && typeof arrayBuffer !== 'string') {
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setDocxHtml(result.value);
            setDocxFileName(file.title);
            setDocxPreviewOpen(true);
          }
        };
        reader.readAsArrayBuffer(fileObj);
      } catch (e) {
        alert('docx 미리보기에 실패했습니다.');
      }
      return;
    }
    // PDF 기존 로직
    if (fileType === 'pdf') {
      try {
        const blob = await downloadDocument(Number(file.id));
        const url = window.URL.createObjectURL(
          new Blob([blob], { type: 'application/pdf' })
        );
        setPdfBlobUrl(url);
        setPdfFileName(file.title);
        setPdfPreviewOpen(true);
      } catch (e) {
        alert('문서 미리보기에 실패했습니다.');
      }
    }
  };

  // 파일 타입을 사용자 친화적으로 변환하는 함수
  const getFriendlyFileType = (file: UploadedFile) => {
    const type = (file.type || '').toLowerCase();
    const title = (file.title || '').toLowerCase();
    const ext = title.split('.').pop();

    // 확장자 기반 체크
    if (ext === 'docx') return 'Word 문서';
    if (ext === 'pdf') return 'PDF 문서';
    if (ext === 'txt') return '텍스트 문서';
    if (ext === 'jpg' || ext === 'jpeg') return '이미지';
    if (ext === 'png') return '이미지';
    if (ext === 'mp4') return '비디오';
    if (ext === 'mp3') return '오디오';

    // MIME 타입 기반 체크
    if (type.includes('word') || type.includes('docx')) return 'Word 문서';
    if (type.includes('pdf')) return 'PDF 문서';
    if (type.includes('text')) return '텍스트 문서';
    if (type.includes('image')) return '이미지';
    if (type.includes('video')) return '비디오';
    if (type.includes('audio')) return '오디오';

    return '기타 파일';
  };

  return (
    <div className='flex-1 bg-white rounded-3xl shadow-sm '>
      <div className={twMerge('w-full space-y-4 py-6', className)}>
        <div className='flex justify-between items-center px-6'>
          <h2 className='text-xl font-bold'>업로드 된 자료</h2>
          {showAddButton && (
            <Button
              variant='filled'
              className='px-4 py-2 text-xs rounded-[10px]'
              onClick={() => onClick?.()}
            >
              + 자료 추가
            </Button>
          )}
        </div>
        {/* 업로드 진행률 */}
        <div className='space-y-2 px-6'>
          <div className='flex justify-between items-center'>
            <span className='text-sm'>자료 한도</span>
            <span className='text-sm'>
              {safeFiles.length}/{maxFiles}
            </span>
          </div>
          <div className='h-2 rounded-full bg-gray-200 overflow-hidden'>
            <div
              className='h-full rounded-full transition-all duration-300 bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500'
              style={{
                width: `${(safeFiles.length / maxFiles) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 파일 목록 */}
        <SimpleBar className='h-[50dvh] px-6'>
          <div className='space-y-3'>
            {isLoading ? (
              <div className='text-center text-purple-500 py-8'>로딩 중...</div>
            ) : !safeFiles || safeFiles.length === 0 ? (
              <div className='text-gray-400 text-center py-8'>
                업로드된 파일이 없습니다
              </div>
            ) : (
              safeFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex cursor-pointer items-start justify-between gap-3 p-4 rounded-2xl border transition-colors duration-200
                    ${
                      !showAddButton && selectedIds.includes(file.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  onClick={() => {
                    const type = (file.type || '').toLowerCase();
                    const title = (file.title || '').toLowerCase();
                    const ext = title.split('.').pop();

                    // DOCX 분기
                    if (
                      ext === 'docx' ||
                      type.includes('docx') ||
                      type ===
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ) {
                      handlePreviewDocument(file, 'docx');
                      return;
                    }

                    // PDF 분기
                    if (
                      ext === 'pdf' ||
                      type.includes('pdf') ||
                      type === 'application/pdf'
                    ) {
                      handlePreviewDocument(file, 'pdf');
                      return;
                    }

                    // 그 외는 상세보기
                    handleDetailOpen(file);
                  }}
                >
                  <div className='flex items-start gap-3'>
                    {!showAddButton && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect?.(file.id);
                        }}
                        className='relative w-5 h-5 mt-1 cursor-pointer flex-shrink-0'
                      >
                        <div
                          className={`absolute inset-0 rounded border-2 transition-colors duration-200
                          ${
                            selectedIds.includes(file.id)
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300 hover:border-purple-300'
                          }`}
                        />
                        {selectedIds.includes(file.id) && (
                          <IconBox
                            name='checkW'
                            size={16}
                            className='absolute inset-0 m-auto text-white'
                          />
                        )}
                      </div>
                    )}
                    <div className='space-y-1 min-w-0'>
                      <h3 className='font-medium whitespace-normal break-words'>
                        {file.title}
                      </h3>
                      <span className='text-sm text-gray-500'>
                        {getFriendlyFileType(file)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(file.id);
                    }}
                    className='p-1 rounded-full cursor-pointer'
                  >
                    <IconBox name='x' size={20} className='text-gray-400' />
                  </button>
                </div>
              ))
            )}
          </div>
        </SimpleBar>
      </div>
      {/* 상세 모달 */}
      <UploadedListDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        detailData={detailData}
        isLoading={detailLoading}
      />
      {/* PDF 미리보기 모달 */}
      <PDFPreviewModal
        isOpen={pdfPreviewOpen}
        onClose={handleClosePreview}
        blobUrl={pdfBlobUrl}
        onDownload={handleDownloadFromPreview}
        fileName={pdfFileName}
      />
      {/* DOCX 미리보기 모달 */}
      {docxPreviewOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/40'
            onClick={() => setDocxPreviewOpen(false)}
          />
          <div className='relative bg-white rounded-2xl w-[80vw] h-[90vh] p-8 flex flex-col items-center shadow-lg z-10 overflow-auto'>
            <div className='w-full flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold'>
                {docxFileName || 'DOCX 미리보기'}
              </h2>
              <button
                onClick={() => setDocxPreviewOpen(false)}
                className='p-1 rounded-full cursor-pointer'
              >
                <IconBox name='x' size={20} className='text-gray-400' />
              </button>
            </div>
            <div
              className='w-full flex-1 overflow-auto prose prose-sm max-w-none'
              style={{
                minHeight: 200,
                background: '#fafafa',
                borderRadius: 8,
                padding: 16,
              }}
            >
              {docxHtml ? (
                <div dangerouslySetInnerHTML={{ __html: docxHtml }} />
              ) : (
                <div className='text-gray-400 text-center py-8'>
                  내용을 불러오는 중입니다...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadedList;
