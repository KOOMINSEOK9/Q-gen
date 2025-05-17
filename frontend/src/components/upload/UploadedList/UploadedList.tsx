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

  const handlePreviewPdf = async (file: UploadedFile) => {
    try {
      const blob = await downloadDocument(Number(file.id));
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/pdf' })
      );
      setPdfBlobUrl(url);
      setPdfFileName(
        file.title.endsWith('.pdf') ? file.title : file.title + '.pdf'
      );
      setPdfPreviewOpen(true);
    } catch (e) {
      alert('PDF 미리보기에 실패했습니다.');
    }
  };

  return (
    <div className='flex-1 bg-white rounded-3xl shadow-sm '>
      <div className={twMerge('w-full space-y-4 py-6', className)}>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold px-6'>업로드 된 자료</h2>
          {showAddButton && (
            <Button
              variant='filled'
              className='px-2 py-1 text-xs'
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
                    if (file.type.toLowerCase().includes('pdf')) {
                      handlePreviewPdf(file);
                    } else {
                      handleDetailOpen(file);
                    }
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
                      <span className='text-sm text-gray-500'>{file.type}</span>
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
      <PDFPreviewModal
        isOpen={pdfPreviewOpen}
        onClose={handleClosePreview}
        blobUrl={pdfBlobUrl}
        onDownload={handleDownloadFromPreview}
        fileName={pdfFileName}
      />
    </div>
  );
}

export default UploadedList;
