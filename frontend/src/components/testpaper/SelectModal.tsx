import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workBookId: number;
  testPaperId: number;
}

function SelectModal({
  isOpen,
  onClose,
  workBookId,
  testPaperId,
}: SelectModalProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'문제 보기' | '문제 풀기'>(
    '문제 보기'
  );

  if (!isOpen) return null;

  const handleSelect = () => {
    if (selected === '문제 보기') {
      navigate(`/note/${workBookId}/${testPaperId}`);
    } else {
      navigate(`/quiz/${testPaperId}`);
    }
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/30' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl w-[340px] p-8 flex flex-col items-center shadow-lg z-10'>
        {/* Header */}
        <div className='w-full flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>어떤 곳으로 이동할까요?</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-2xl'
          >
            ×
          </button>
        </div>

        {/* 선택 버튼 */}
        <div className='w-full flex flex-col gap-3 mb-6'>
          <button
            className={`w-full py-3 rounded-xl border text-base font-semibold transition-colors cursor-pointer ${
              selected === '문제 보기'
                ? 'bg-purple-100 border-purple-400 text-purple-700'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            onClick={() => setSelected('문제 보기')}
          >
            문제 보기
          </button>
          <button
            className={`w-full py-3 rounded-xl border text-base font-semibold transition-colors cursor-pointer ${
              selected === '문제 풀기'
                ? 'bg-purple-100 border-purple-400 text-purple-700'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            onClick={() => setSelected('문제 풀기')}
          >
            문제 풀기
          </button>
        </div>

        {/* 이동 버튼 */}
        <button
          className='w-full py-3 rounded-xl bg-gradient-to-r from-[#8B65FF] to-[#754AFF] text-white font-bold text-lg mt-2 transition-all hover:brightness-110 cursor-pointer'
          onClick={handleSelect}
        >
          이동하기
        </button>
      </div>
    </div>
  );
}

export default SelectModal;
