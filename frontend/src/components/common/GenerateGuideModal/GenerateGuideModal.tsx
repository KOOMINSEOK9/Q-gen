// src/components/common/GenerateGuideModal.tsx

import { useEffect } from 'react';

interface GenerateGuideModalProps {
  isOpen: boolean;
  workBookId: number | string;
  onClose?: () => void;
}

export default function GenerateGuideModal({
  isOpen,
  workBookId,
  onClose,
}: GenerateGuideModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        window.location.href = `/list/${workBookId}`;
        if (onClose) onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, workBookId, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' />
      <div className='relative bg-white rounded-2xl w-[90%] max-w-[400px] p-8 flex flex-col items-center shadow-lg z-10'>
        <div className='w-20 h-20 mb-8 flex items-center justify-center'>
          <div className='dolphin-spinner'>
            <div className='spinner'></div>
            <img
              src='/images/dolpin-with-tablet.png'
              alt='돌고래 아이콘'
              className='dolphin-img'
              draggable={false}
            />
          </div>
        </div>
        <h2 className='text-2xl font-bold mb-4 text-center'>
          시험지가 생성됩니다.
        </h2>
        <img
          className='rounded-2xl mb-3'
          src='/images/guideImgs/GenerateGuide.gif'
          alt='생성 안내 gif'
        />
        <p className='text-gray-600 text-center mb-2'>
          시험지 생성은 최대 1분 소요되며, <br />
          시험지 생성 완료 시 알림으로 알려드려요! <br />
          (시간이 소요될 경우에 한함)
        </p>
      </div>
    </div>
  );
}
