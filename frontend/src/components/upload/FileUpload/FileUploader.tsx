import React, { useState } from 'react';
import uploadGlassIcon from '@/assets/icons/upload-glass.png';
import linkGlassIcon from '@/assets/icons/link-glass.png';
import textGlassIcon from '@/assets/icons/text-glass.png';
import TextUploadModal from './TextUploadModal';
import { useDocuments } from '@/hooks/useDocument';
import GlobalSpinner from '@/components/common/GlobalSpinner/GlobalSpinner';
import { useParams } from 'react-router-dom';
import { DocumentInfo } from '@/types/document';
import LinkUploadModal from './LinkUploadModal';
import Swal from 'sweetalert2';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  onLinkSubmit: (result: DocumentInfo) => void;
  onTextSubmit: (result: DocumentInfo) => void;
  className?: string;
}

const pulseAnimation = `
  @keyframes iconPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes bgPulse {
    0% { background-color: rgb(243 232 255); }
    50% { background-color: white; }
    100% { background-color: rgb(243 232 255); }
  }
`;

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  onLinkSubmit,
  onTextSubmit,
  className = '',
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const { isLoading } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);
  const { workBookId } = useParams();
  const numericWorkBookId = workBookId ? Number(workBookId) : undefined;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      try {
        // await uploadDocument(file, workBookId);
        onFileUpload(file);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '파일 업로드에 실패했습니다.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        // await uploadDocument(file, workBookId);
        onFileUpload(file);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '파일 업로드에 실패했습니다. 다시 시도해주세요.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  return (
    <div
      className={`flex flex-col min-h-[80dvh] w-full select-none h-full ${className}`}
    >
      <style>{pulseAnimation}</style>
      {/* 전역 스피너 */}
      <GlobalSpinner show={isLoading} />

      <h1 className='text-xl font-bold mb-2'>문제 생성 소스</h1>
      <p className='text-gray-500 mb-8'>
        문제 생성에 사용할 자료를 업로드하세요.
      </p>

      <div className='flex flex-col gap-4 h-full'>
        {/* 파일 선택 영역 */}
        <div
          className={`basis-2/3 border-2 border-dashed rounded-lg py-12 mb-0 flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 select-none
            ${
              isDragging
                ? 'border-purple-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          style={{
            animation: isDragging ? 'bgPulse 1.2s infinite' : 'none',
            backgroundColor: isDragging ? 'rgb(243 232 255)' : 'white',
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <img
            src={uploadGlassIcon}
            alt='upload'
            className={`h-15 w-15 my-3 transition-transform duration-300 group-hover:scale-110 select-none`}
            style={{
              animation: isDragging ? 'iconPulse 1.2s infinite' : 'none',
            }}
            draggable='false'
          />
          <h2 className='text-xl font-semibold mb-2 select-none'>
            파일 선택하기
          </h2>
          <p className='text-gray-500 mb-4 text-center select-none'>
            파일을 드래그하거나 선택하여 업로드하세요. <br />
            PDF, DOCX, TXT 파일을 지원합니다.
          </p>
          <input
            type='file'
            onChange={handleFileInput}
            accept='.pdf,.docx,.txt'
            className='hidden'
            id='fileInput'
          />
        </div>

        <div className='flex flex-row gap-4 basis-1/3'>
          {/* Link Input Option */}
          <div
            className='bg-white rounded-lg p-8 border border-gray-200 hover:border-gray-300 flex flex-col items-center flex-1 cursor-pointer group select-none'
            onClick={() => setShowLinkModal(true)}
          >
            <img
              src={linkGlassIcon}
              alt='link'
              className='h-15 w-15 my-3 transition-transform duration-300 group-hover:scale-110 select-none'
              draggable='false'
            />
            <h3 className='text-lg font-semibold select-none'>
              링크로 가져오기
            </h3>
            <p className='text-sm text-gray-500 text-center select-none'>
              웹 URL에 표시되는 텍스트를 가져옵니다.
            </p>
          </div>

          {/* Direct Text Input Option */}
          <div
            className='bg-white rounded-lg p-8 border border-gray-200 hover:border-gray-300 flex flex-col items-center flex-1 cursor-pointer group select-none'
            onClick={() => setShowTextModal(true)}
          >
            <img
              src={textGlassIcon}
              alt='text'
              className='h-15 w-15 my-3 transition-transform duration-300 group-hover:scale-110 select-none'
              draggable='false'
            />
            <h3 className='text-lg font-semibold select-none'>
              텍스트 입력하기
            </h3>
            <p className='text-sm text-gray-500 text-center select-none'>
              텍스트를 직접 입력하여 문제를 생성합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Link Upload Modal */}
      {showLinkModal && numericWorkBookId !== undefined && (
        <LinkUploadModal
          onClose={() => setShowLinkModal(false)}
          onSubmit={(result) => {
            if (onLinkSubmit) onLinkSubmit(result);
            setShowLinkModal(false);
          }}
          workBookId={numericWorkBookId}
        />
      )}
      {/* Text Upload Modal */}
      {showTextModal && numericWorkBookId !== undefined && (
        <TextUploadModal
          onClose={() => setShowTextModal(false)}
          onSubmit={(result) => {
            if (onTextSubmit) onTextSubmit(result);
            setShowTextModal(false);
          }}
          workBookId={numericWorkBookId}
        />
      )}
    </div>
  );
};

export default FileUploader;
