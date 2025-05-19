import { useRef, useEffect, useState } from 'react';
import { NoteProps } from '@/types/note';
import Button from '@/components/common/Button/Button';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import type { NoteTestHistory } from '@/types/note';

function Test({
  currentNumber,
  totalNumber,
  test,
  options,
  selectedOption,
  isSubmitted,
  answerIndex,
  explanation,
  explanationBox,
  incorrectCount,
  onNext,
  onPrev,
  testHistoryList,
  type,
  answer,
}: Omit<NoteProps, 'onSelect'> & {
  testHistoryList: NoteTestHistory[];
  answer: string;
  type: 'choiceAns' | 'shortAns' | 'oxAns';
  explanationBox?: string[];
}) {
  const explanationRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isSubmitted && explanationRef.current) {
      explanationRef.current.style.maxHeight =
        explanationRef.current.scrollHeight + 'px';
      explanationRef.current.style.opacity = '1';
    } else if (explanationRef.current) {
      explanationRef.current.style.maxHeight = '0px';
      explanationRef.current.style.opacity = '0';
    }
  }, [isSubmitted]);

  // 날짜 포맷 함수: '2024-06-07T12:34:56' -> '24.06.07'
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const yy = d.getFullYear().toString().slice(-2);
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
  };

  // OX 문제 렌더링
  const renderOXQuestion = () => (
    <div className='flex gap-4 justify-center mb-2'>
      {['O', 'X'].map((option, idx) => {
        let optionStyle = 'border-gray-200 py-20';
        let textStyle = '';
        const isAnswer = answerIndex === idx;
        const isSelected = selectedOption === idx;
        if (isSubmitted) {
          if (isSelected && isAnswer) {
            optionStyle = 'border-[#009d77]/20 bg-[#009d77]/10 border-2 py-20';
            textStyle = 'font-base';
          } else if (isSelected) {
            optionStyle = 'border-[#ff4339]/20 bg-[#ff4339]/10 border-2 py-20';
            textStyle = 'font-base';
          } else if (isAnswer) {
            optionStyle = 'border-[#009d77]/20 bg-[#009d77]/10 border-2 py-20';
            textStyle = 'font-base';
          }
        } else if (isSelected) {
          optionStyle = 'border-[#754AFF]/20 bg-[#754AFF]/10 border-2 py-20';
          textStyle = 'font-base';
        }
        return (
          <div
            key={option}
            className={`w-full h-[259px] border-1 rounded-3xl cursor-pointer transition-colors flex items-center justify-center text-8xl font-base ${optionStyle}`}
          >
            <span className={textStyle}>{option}</span>
          </div>
        );
      })}
    </div>
  );

  // 객관식 문제 렌더링
  const renderMultipleChoice = () => (
    <div className='space-y-3 mb-2'>
      {options.map((option, index) => {
        let optionStyle = 'border-gray-200 py-3';
        let textStyle = 'flex items-center';
        if (isSubmitted) {
          if (index === answerIndex) {
            optionStyle = 'border-[#009d77]/20 bg-[#009d77]/10 py-3';
            textStyle = 'font-bold';
          } else if (index === selectedOption) {
            optionStyle = 'border-[#ff4339]/20 bg-[#ff4339]/10 py-3';
            textStyle = 'font-bold';
          }
        }
        return (
          <div
            key={index}
            className={`p-4 border-1 rounded-2xl cursor-pointer transition-colors ${optionStyle}`}
          >
            <span className={textStyle}>
              <span className='mr-4'>{index + 1}</span>
              <span>{option}</span>
            </span>
          </div>
        );
      })}
    </div>
  );

  // 주관식 문제 렌더링
  const renderShortAnswer = () => {
    const isWrong =
      isSubmitted &&
      typeof selectedOption === 'string' &&
      selectedOption !== answer;
    return (
      <div className='mb-2'>
        <input
          type='text'
          className={`w-full p-4 border-1 rounded-2xl ${isWrong ? 'border-[#ff4339]/20 font-bold bg-[#ff4339]/10' : 'border-gray-200'} `}
          placeholder='문제를 풀어보세요'
          value={typeof selectedOption === 'string' ? selectedOption : ''}
          disabled={isSubmitted}
          readOnly
        />
        {isSubmitted && (
          <div className='mt-2 text-gray-700 bg-[#009d77]/10 border border-[#009d77]/20 rounded-2xl p-4'>
            정답: <span className='font-bold'>{answer}</span>
          </div>
        )}
      </div>
    );
  };

  // 문제 유형에 따른 렌더링
  const renderQuestion = () => {
    switch (type) {
      case 'oxAns':
        return renderOXQuestion();
      case 'shortAns':
        return renderShortAnswer();
      case 'choiceAns':
      default:
        return renderMultipleChoice();
    }
  };

  return (
    <div className='w-full h-full min-h-0 bg-white rounded-3xl p-6 shadow-sm'>
      <div className='flex justify-between items-center mb-2'>
        {/* 문제 번호와 오답 횟수 */}
        <div className='flex items-center gap-1'>
          <p className='text-base font-bold mr-1'>
            문제 {currentNumber}/{totalNumber}
          </p>
          <div className='flex items-center gap-1 px-2 py-1'>
            <div className='bg-rose-400 text-white text-sm rounded-lg px-2 py-1'>
              오답 {incorrectCount}회
            </div>
          </div>
          <Button
            variant='filled'
            className='py-1 px-2.5 text-sm rounded-lg'
            onClick={() => setModalOpen(true)}
          >
            제출이력
          </Button>
        </div>
        {/* 이전/다음/제출이력 버튼 */}
        <div className='flex items-center gap-2'>
          <Button onClick={onPrev} variant='small' className='my-1 text-xs'>
            이전
          </Button>
          <Button onClick={onNext} variant='small' className='my-1 text-xs'>
            다음
          </Button>
        </div>
      </div>
      {/* 문제 내용 */}
      <div className='mb-4'>
        <h2 className='text-lg font-bold'>{test}</h2>
        {explanationBox && explanationBox.length > 0 && (
          <div className='border border-gray-200 p-4 rounded-lg bg-white mt-4 mb-0'>
            {explanationBox.map((exp, idx) => (
              <div key={idx} className='flex items-center'>
                <span className='mr-2 text-gray-700'>•</span>
                {exp}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='flex-1 min-h-0 flex flex-col'>
        {/* 문제 유형에 따른 렌더링 */}
        {renderQuestion()}
        {/* 해설 */}
        {isSubmitted && (
          <SimpleBar className='mt-2 mb-0 bg-[#CAC7FC]/20 rounded-3xl max-h-52 flex flex-col p-6 w-full overflow-auto'>
            <div className='font-semibold mb-2 text-gray-700'>해설</div>
            <div className='text-gray-700'>{explanation}</div>
          </SimpleBar>
        )}
      </div>
      {/* Modal for test history */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div
            className='absolute inset-0 bg-black/30'
            onClick={() => setModalOpen(false)}
          />
          <div className='relative bg-white rounded-2xl w-[420px] max-h-[80vh] p-8 flex flex-col items-center shadow-lg z-10'>
            <div className='w-full flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold'>제출 이력</h2>
              <button
                onClick={() => setModalOpen(false)}
                className='text-gray-400 hover:text-gray-600 text-2xl'
              >
                ×
              </button>
            </div>
            <div className='w-full flex flex-col gap-2 overflow-y-auto'>
              <div className='grid grid-cols-3 gap-2 px-2 py-1 border-b border-gray-700 text-sm font-semibold text-gray-700 rounded-t-lg'>
                <div>제출일</div>
                <div className='text-center'>내 답안</div>
                <div className='text-center'>정오답</div>
              </div>
              {testHistoryList.length === 0 ? (
                <div className='text-center text-gray-500 py-8'>
                  이력이 없습니다.
                </div>
              ) : (
                testHistoryList.map((history) => (
                  <div
                    key={history.testHistoryId}
                    className={`grid grid-cols-3 gap-2 px-2 py-2 items-center text-sm rounded-lg ${history.correct ? 'bg-green-50' : 'bg-rose-50'}`}
                  >
                    <div className='truncate text-xs text-gray-700'>
                      {formatDate(history.createAt)}
                    </div>
                    <div
                      className={`text-center font-semibold ${history.correct ? 'text-[#009d77]/80' : 'text-[#ff4339]/80'}`}
                    >
                      {history.userAnswer}
                    </div>
                    <div className='text-center'>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${history.correct ? 'bg-green-200 text-[#009d77]/80' : 'bg-rose-200 text-[#ff4339]/80'}`}
                      >
                        {history.correct ? '정답' : '오답'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Test;
