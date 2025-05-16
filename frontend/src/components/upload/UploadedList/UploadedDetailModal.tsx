import React from 'react';
import IconBox from '@/components/common/IconBox/IconBox';
import { DocumentInfo } from '@/types/document';

interface UploadedListDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailData: DocumentInfo | null;
  isLoading: boolean;
}

const UploadedListDetailModal: React.FC<UploadedListDetailModalProps> = ({
  isOpen,
  onClose,
  detailData,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/30' onClick={onClose} />
      {/* Modal */}
      <div className='relative bg-white rounded-2xl w-[480px] max-h-[80vh] p-8 flex flex-col items-center shadow-lg z-10'>
        {/* Header */}
        <div className='w-full flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>자료 상세 정보</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-2xl'
          >
            <IconBox name='x' size={24} />
          </button>
        </div>
        {/* Content */}
        {isLoading ? (
          <div className='text-center text-purple-500 py-8'>로딩 중...</div>
        ) : detailData ? (
          <div className='w-full flex flex-col gap-4'>
            <div>
              <span className='font-semibold text-gray-700'>이름: </span>
              <span>{detailData.documentName}</span>
            </div>
          </div>
        ) : (
          <div className='text-center text-gray-400 py-8'>
            자료 정보를 불러올 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadedListDetailModal;
