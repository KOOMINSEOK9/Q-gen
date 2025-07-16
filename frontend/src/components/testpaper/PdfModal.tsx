import { useState } from 'react';

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (option: '문제만' | '정답/해설포함') => void;
}

function PdfModal({ isOpen, onClose, onDownload }: PdfModalProps) {
  const [selected, setSelected] = useState<'문제만' | '정답/해설포함'>(
    '문제만'
  );

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/30' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl w-[340px] p-8 flex flex-col items-center shadow-lg z-10'>
        {/* Header */}
        <div className='w-full flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>어떻게 변환할까요?</h2>
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
              selected === '문제만'
                ? 'bg-purple-100 border-purple-400 text-purple-700'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            onClick={() => setSelected('문제만')}
          >
            문제만
          </button>
          <button
            className={`w-full py-3 rounded-xl border text-base font-semibold transition-colors cursor-pointer ${
              selected === '정답/해설포함'
                ? 'bg-purple-100 border-purple-400 text-purple-700'
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            onClick={() => setSelected('정답/해설포함')}
          >
            정답/해설포함
          </button>
        </div>

        {/* PDF 다운로드 버튼 */}
        <button
          className='w-full py-3 rounded-xl bg-gradient-to-r from-[#8B65FF] to-[#754AFF] text-white font-bold text-lg mt-2 transition-all hover:brightness-110 cursor-pointer'
          onClick={() => onDownload(selected)}
        >
          PDF 다운로드
        </button>
      </div>
    </div>
  );
}

export default PdfModal;
