// src/components/common/NoDocumentWarningModal/NoDocumentWarningModal.tsx

import Button from '@/components/common/Button/Button';
import IconBox from '../IconBox/IconBox';
import { useModalStore } from '@/stores/modalStore';

interface NoDocumentWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoDocumentWarningModal({
  isOpen,
  onClose,
}: NoDocumentWarningModalProps) {
  const { setShowTextModal, setShowBasicGuideModal } = useModalStore();

  if (!isOpen) return null;

  const handleTextModalOpen = () => {
    onClose();
    setShowTextModal(true);
  };

  const handleGuideModalOpen = () => {
    onClose();
    setShowBasicGuideModal(true);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />
      <div className='relative bg-white rounded-2xl w-[90%] max-w-[440px] py-8 px-12 flex flex-col items-center shadow-lg z-10'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 p-1 rounded-full cursor-pointer'
        >
          <IconBox name='x' size={30} className='text-gray-400' />
        </button>
        <div className='flex flex-col items-center gap-4 mb-6'>
          <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center'>
            <IconBox name='text' size={32} className='text-purple-500' />
          </div>
          <h2 className='text-2xl font-bold text-center'>
            자료 업로드가 필요해요!
          </h2>
        </div>
        <div className='text-center mb-8'>
          <p className='text-gray-600 mb-2'>
            문제 생성을 위해서는 자료 업로드가 필수에요🥲
          </p>
          <p className='text-gray-600 mb-2'>
            사용자 입력 텍스트에 <strong>"데이터베이스 정규화"</strong>와 같은
            <br></br>
            간단한 키워드만으로도 문제를 생성할 수 있어요!
          </p>
          <p className='text-gray-600 font-bold text-md text-purple-500'>
            가벼운 텍스트 데이터라도 입력해보는 건 어떨까요?
          </p>
        </div>
        <div className='flex flex-col gap-2 w-full'>
          <Button
            variant='outlined'
            className='w-full'
            onClick={handleTextModalOpen}
          >
            네, 텍스트 입력창을 띄워주세요.
          </Button>
          <Button variant='filled' className='w-full' onClick={onClose}>
            직접 업로드할게요
          </Button>
          <div className='flex gap-2 text-sm justify-center'>
            <p className='text-gray-600 text-center'>
              문제 생성이 처음이라면? <br></br>
            </p>
            <button onClick={handleGuideModalOpen} className='text-purple-600'>
              Qgen 문제 생성 가이드보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
