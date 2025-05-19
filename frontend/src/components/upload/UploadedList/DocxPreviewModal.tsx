import React from 'react';
import IconBox from '@/components/common/IconBox/IconBox';

interface DocxPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  docxHtml: string | null;
  fileName: string;
}

const DocxPreviewModal: React.FC<DocxPreviewModalProps> = ({
  isOpen,
  onClose,
  docxHtml,
  fileName,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative bg-white rounded-2xl w-[80vw] h-[90vh] p-8 flex flex-col items-center shadow-lg z-10 overflow-auto'>
        <div className='w-full flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold'>{fileName || 'DOCX 미리보기'}</h2>
          <button
            onClick={onClose}
            className='p-1 rounded-full cursor-pointer text-gray-400 hover:text-gray-600 transition-transform duration-200 hover:scale-110'
          >
            <IconBox name='x' size={20} />
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
  );
};

export default DocxPreviewModal;
