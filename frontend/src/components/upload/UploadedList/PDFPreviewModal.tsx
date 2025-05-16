import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';
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
      <div className='relative bg-white rounded-2xl w-[80vw] h-[90vh] p-6 flex flex-col items-center shadow-lg z-10'>
        <div className='w-full flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>{fileName}</h2>
          <button onClick={onClose} className='p-1 rounded-full cursor-pointer'>
            <IconBox name='x' size={20} className='text-gray-400' />
          </button>
        </div>
        <iframe
          src={blobUrl}
          title='PDF 미리보기'
          className='w-full flex-1 rounded-lg border'
        />
        <Button
          onClick={onDownload}
          variant='filled'
          className='mt-4 px-6 py-2 text-white rounded-lg font-base'
        >
          다운로드
        </Button>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
