import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';
import { useState, useEffect } from 'react';

interface WorkBookTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  defaultTitle?: string;
  titleText: string;
  submitText: string;
}

export default function WorkBookTitleModal({
  isOpen,
  onClose,
  onSubmit,
  defaultTitle = '',
  titleText,
  submitText,
}: WorkBookTitleModalProps) {
  const [title, setTitle] = useState(defaultTitle);

  useEffect(() => {
    setTitle(defaultTitle);
  }, [defaultTitle, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title);
      setTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative bg-white rounded-2xl w-[480px] p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold'>{titleText}</h2>
          <button
            onClick={onClose}
            className='text-gray-400 cursor-pointer hover:text-gray-600'
          >
            <IconBox name='x' size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              문제집 제목
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && title.trim()) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder='제목을 입력해주세요'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outlined' onClick={onClose}>
              취소
            </Button>

            <Button
              variant='basic'
              onClick={handleSubmit}
              disabled={!title.trim()}
            >
              {submitText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
