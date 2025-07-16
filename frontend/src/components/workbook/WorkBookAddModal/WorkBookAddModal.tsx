// src/components/list/WorkBookAddModal/WorkBookAddModal.tsx
import React from 'react';
import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';

interface WorkBookAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

function WorkBookAddModal({
  isOpen,
  onClose,
  onSubmit,
}: WorkBookAddModalProps) {
  const [title, setTitle] = React.useState('');

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
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl w-[480px] p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold'>새 문제집 만들기</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            <IconBox name='x' size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className='mb-6'>
            <label
              htmlFor='workbook-title'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              문제집 제목
            </label>
            <input
              id='workbook-title'
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='제목을 입력해주세요'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            />
          </div>

          {/* Footer */}
          <div className='flex justify-end gap-2'>
            <Button variant='outlined' onClick={onClose}>
              취소
            </Button>
            <Button variant='filled' disabled={!title.trim()}>
              만들기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkBookAddModal;
