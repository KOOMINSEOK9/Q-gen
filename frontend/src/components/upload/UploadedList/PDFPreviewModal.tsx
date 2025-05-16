import React from 'react';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blobUrl: string | null;
  onDownload: () => void;
  fileName: string;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  blobUrl,
  onDownload,
  fileName,
}) => {
  if (!isOpen || !blobUrl) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative bg-white rounded-2xl w-[80vw] h-[80vh] p-6 flex flex-col items-center shadow-lg z-10'>
        <div className='w-full flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>{fileName} 미리보기</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-2xl'
          >
            ×
          </button>
        </div>
        <iframe
          src={blobUrl}
          title='PDF 미리보기'
          className='w-full flex-1 rounded border'
        />
        <button
          onClick={onDownload}
          className='mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold'
        >
          다운로드
        </button>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
