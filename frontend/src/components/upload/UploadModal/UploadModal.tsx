// src/components/list/UploadModal/UploadModal.tsx
import React from 'react';
import FileUploader from '@/components/upload/FileUpload/FileUploader';
import IconBox from '@/components/common/IconBox/IconBox';
import { DocumentInfo } from '@/types/document';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
  onLinkSubmit: (result: DocumentInfo) => void;
  onTextSubmit: (result: DocumentInfo) => void;
  workBookId?: number;
  setUploading?: (uploading: boolean) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  onLinkSubmit,
  onTextSubmit,
  workBookId,
  setUploading,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      {/* Modal Content */}
      <div className='relative bg-white rounded-2xl w-full max-w-3xl p-8 shadow-lg z-10 min-h-[80dvh]'>
        {/* Modal Header */}
        <div className='flex items-center justify-end absolute top-8 right-8'>
          {/* <h2 className='text-xl font-bold'>자료 업로드</h2> */}
          <button
            onClick={onClose}
            className='cursor-pointer text-gray-400 hover:text-gray-600 text-2xl'
            aria-label='닫기'
          >
            <IconBox name='x' size={24} />
          </button>
        </div>
        {/* FileUploader 본체 */}
        <FileUploader
          onFileUpload={onFileUpload}
          onLinkSubmit={onLinkSubmit}
          onTextSubmit={onTextSubmit}
          // workBookId={workBookId || 0}
          setUploading={setUploading}
        />
      </div>
    </div>
  );
};

export default UploadModal;
