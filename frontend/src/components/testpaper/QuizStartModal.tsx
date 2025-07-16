import { useState } from 'react';

interface QuizStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (
    mode: 'practice' | 'real',
    timer?: { min: number; sec: number }
  ) => void;
}

function QuizStartModal({ isOpen, onClose, onStart }: QuizStartModalProps) {
  const [mode, setMode] = useState<'practice' | 'real'>('practice');
  const [timer, setTimer] = useState({ min: 0, sec: 0 });

  if (!isOpen) return null;

  const handleTimerChange = (type: 'min' | 'sec', value: string) => {
    let num = Number(value.replace(/[^0-9]/g, ''));
    if (num > 99) num = 99;
    setTimer((prev) => ({
      ...prev,
      [type]: num,
    }));
  };

  const handleStart = () => {
    if (mode === 'real' && timer.min === 0 && timer.sec === 0) {
      alert('타이머를 설정해주세요.');
      return;
    }
    onStart(mode, mode === 'real' ? timer : undefined);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/30' onClick={onClose} />

      {/* Modal */}
      <div className='relative bg-white rounded-2xl w-[360px] p-8 flex flex-col items-center shadow-lg z-10'>
        {/* Header */}
        <div className='w-full flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>어떤 모드로 진행할까요?</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 text-2xl'
          >
            ×
          </button>
        </div>

        {/* 모드 선택 탭 */}
        <div className='w-full flex '>
          <button
            className={`flex-1 flex flex-col items-center py-3 rounded-t-xl border transition-colors
              ${
                mode === 'practice'
                  ? 'border-purple-500 border-b-0 bg-white'
                  : 'border-gray-200 bg-gray-50'
              }
            `}
            style={{
              borderRightWidth: '1px',
              borderLeftWidth: '1px',
              borderTopWidth: '1.5px',
            }}
            onClick={() => setMode('practice')}
          >
            <span className='mb-1 text-purple-500 text-xl'>✏️</span>
            <span className='font-semibold text-base'>연습 모드</span>
          </button>
          <button
            className={`flex-1 flex flex-col items-center py-3 rounded-t-xl border transition-colors
              ${
                mode === 'real'
                  ? 'border-purple-500 border-b-0 bg-white'
                  : 'border-gray-200 bg-gray-50'
              }
            `}
            style={{
              borderRightWidth: '1px',
              borderTopWidth: '1.5px',
            }}
            onClick={() => setMode('real')}
          >
            <span className='mb-1 text-purple-500 text-xl'>⏱️</span>
            <span className='font-semibold text-base'>실전 모드</span>
          </button>
        </div>

        {/* 모드별 내용 */}
        <div className='w-full min-h-[120px] flex flex-col items-center justify-center border border-purple-200 rounded-b-xl mb-6'>
          {mode === 'practice' ? (
            <div className='text-center text-gray-700 py-6'>
              별도의 시간 제한 없이
              <br />
              시간측정만 진행됩니다.
            </div>
          ) : (
            <div className='flex flex-col items-center py-4'>
              <span className='mb-2 text-gray-700 font-medium'>
                타이머 설정
              </span>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  min={0}
                  max={99}
                  value={timer.min.toString().padStart(2, '0')}
                  onChange={(e) => handleTimerChange('min', e.target.value)}
                  className='w-13 h-13 text-2xl text-center border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
                />
                <span className='text-2xl font-bold'>:</span>
                <input
                  type='number'
                  min={0}
                  max={59}
                  value={timer.sec.toString().padStart(2, '0')}
                  onChange={(e) => handleTimerChange('sec', e.target.value)}
                  className='w-13 h-13 text-2xl text-center border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400'
                />
              </div>
            </div>
          )}
        </div>

        {/* 시작하기 버튼 */}
        <button
          className='w-full py-3 rounded-xl bg-gradient-to-r from-[#8B65FF] to-[#754AFF] text-white font-bold text-lg mt-2 transition-all hover:brightness-110'
          onClick={handleStart}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

export default QuizStartModal;
