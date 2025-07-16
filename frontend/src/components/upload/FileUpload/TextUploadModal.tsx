import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';
import React, { useState, ChangeEvent } from 'react';
import { useDocuments } from '@/hooks/useDocument';
import { DocumentInfo } from '@/types/document';
import Swal from 'sweetalert2';

interface TextUploadModalProps {
  onClose: () => void;
  onSubmit: (result: DocumentInfo) => void;
  workBookId: number;
  setUploading?: (uploading: boolean) => void;
}

const TextUploadModal: React.FC<TextUploadModalProps> = ({
  onClose,
  onSubmit,
  workBookId,
  setUploading,
}) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { convertTextToTxt } = useDocuments();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    // 텍스트 용량 체크 (UTF-8)
    const encoder = new TextEncoder();
    const byteLength = encoder.encode(text).length;
    if (byteLength > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: '10MB 이하 텍스트만 업로드할 수 있습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    setLoading(true);
    setUploading?.(true);
    try {
      const result = await convertTextToTxt(workBookId, text);
      onSubmit(result);
      onClose();
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: '텍스트 업로드에 실패했습니다.',
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
      setUploading?.(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-[1px] flex justify-center items-center z-50'>
      <div className='bg-white w-full max-w-[800px] rounded-2xl p-8 flex flex-col gap-8'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-semibold'>텍스트 직접 입력</h2>
          <button
            onClick={onClose}
            className='text-gray-100 hover:text-black text-xl p-1 hover:scale-120 transition-all'
          >
            <IconBox
              name='x'
              size={24}
              className='text-gray-200 cursor-pointer'
            />
          </button>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='text-lg text-gray-700'>
            소스로 업로드할 텍스트를 아래에 추가해주세요
          </p>

          <div className='flex flex-col border border-gray-200 rounded-lg p-3 bg-gray-50'>
            <textarea
              value={text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setText(e.target.value)
              }
              placeholder='텍스트를 입력해주세요'
              rows={3}
              className='w-full h-[150px] resize-none bg-transparent text-base placeholder-gray-500 focus:outline-none'
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className='w-full font-semibold text-base'
          disabled={loading}
        >
          {loading ? '업로드 중...' : '삽입'}
        </Button>
      </div>
    </div>
  );
};

export default TextUploadModal;
