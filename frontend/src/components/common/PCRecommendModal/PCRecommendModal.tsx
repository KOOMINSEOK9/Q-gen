// src/components/common/PCRecommendModal/PCRecommendModal.tsx

import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';

interface PCRecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PCRecommendModal({
  isOpen,
  onClose,
}: PCRecommendModalProps) {
  if (!isOpen) return null;

  const handlePCVersionClick = () => {
    // 현재 URL을 가져와서 PC 버전 파라미터 추가
    const currentUrl = window.location.href;
    const pcVersionUrl = currentUrl.includes('?')
      ? `${currentUrl}&pc=1`
      : `${currentUrl}?pc=1`;

    // PC 버전 파라미터와 함께 새 탭에서 열기
    window.open(pcVersionUrl, '_blank');
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative bg-white rounded-2xl w-[90%] max-w-[400px] p-6 flex flex-col items-center shadow-lg z-10'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100'
        >
          <IconBox name='x' size={20} className='text-gray-400' />
        </button>

        <div className='w-16 h-16 mb-4'>
          <img src='/images/dolpin-with-tablet.png' alt='돌고래 아이콘' />
        </div>

        <h2 className='text-xl font-bold mb-2'>
          Qgen은 PC 환경에 최적화되어있어요
        </h2>

        <p className='text-gray-600 text-center mb-6'>
          Qgen은 PC 환경에서 더 나은 학습 경험을 제공합니다.
          <br />
          PC로 접속하시면 더 편리하게 이용하실 수 있습니다.
        </p>

        <div className='flex flex-col gap-2 w-full'>
          <Button variant='filled' className='w-full' onClick={onClose}>
            계속하기
          </Button>
          <Button
            variant='outlined'
            className='w-full'
            onClick={handlePCVersionClick}
          >
            PC 버전으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
