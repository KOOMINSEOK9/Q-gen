import React, { useState, ChangeEvent } from 'react';
import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';
import { useDocuments } from '@/hooks/useDocument';

interface LinkUploadModalProps {
  onClose: () => void;
  onSubmit: (url: string) => void;
  workBookId: number;
}

const LinkUploadModal: React.FC<LinkUploadModalProps> = ({
  onClose,
  onSubmit,
  workBookId,
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { convertUrlToTxt } = useDocuments();

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const result = await convertUrlToTxt(workBookId, url);
      console.log('URL 업로드 결과:', result);
      onSubmit(url);
      onClose();
    } catch (e) {
      alert('URL 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-[1px] flex justify-center items-center z-50'>
      <div className='bg-white w-full max-w-[800px] rounded-2xl p-8 flex flex-col gap-8'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-semibold'>링크로 가져오기</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-900 text-xl p-1 hover:scale-120 transition-all cursor-pointer'
          >
            <IconBox name='x' size={24} />
          </button>
        </div>

        <div className='flex flex-col gap-6'>
          <p className='text-lg text-gray-700'>
            소스로 업로드할 웹 URL을 아래에 붙여넣으세요
          </p>

          <div className='flex items-center border border-gray-200 rounded-lg p-3 bg-gray-50'>
            <IconBox name='link' size={20} className='mr-2' />
            <input
              type='text'
              placeholder='URL 붙여넣기'
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              className='flex-1 bg-transparent text-base placeholder-gray-500 focus:outline-none'
            />
          </div>

          <div className='pt-4'>
            <h3 className='text-lg font-semibold mb-2'>참고</h3>
            <div className='flex flex-col gap-1'>
              <p className='text-gray-500'>
                • 현재 웹사이트에 표시되는 텍스트만 저장됩니다.
              </p>
              <p className='text-gray-500'>• 유료 기사는 지원되지 않습니다.</p>
            </div>
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

export default LinkUploadModal;
