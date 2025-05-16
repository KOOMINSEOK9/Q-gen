import { useRef, useEffect } from 'react';
import Button from '@/components/common/Button/Button';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

interface QuestionFrameProps {
  currentNumber: number;
  totalNumber: number;
  question: string;
  options: string[];
  selectedOption: string | null;
  isSubmitted: boolean;
  answerIndex: string;
  explanation: string;
  onSelect: (value: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  questionType?: 'choiceAns' | 'shortAns' | 'oxAns';
  isCorrect?: boolean;
}

function QuestionFrame({
  currentNumber,
  totalNumber,
  question,
  options,
  selectedOption,
  isSubmitted,
  answerIndex,
  explanation,
  onSelect,
  onSubmit,
  onNext,
  questionType = 'choiceAns',
  isCorrect,
}: QuestionFrameProps) {
  const explanationRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // 문제 유형 변환 함수
  const convertQuestionType = (
    type: string
  ): 'choiceAns' | 'shortAns' | 'oxAns' => {
    switch (type) {
      case 'TYPE_OX':
      case 'oxAns':
        return 'oxAns';
      case 'TYPE_CHOICE':
        return 'choiceAns';
      case 'TYPE_SHORT':
        return 'shortAns';
      default:
        return 'choiceAns';
    }
  };

  useEffect(() => {
    const convertedType = convertQuestionType(questionType || '');
    console.log('원본 문제 유형:', questionType);
    console.log('변환된 문제 유형:', convertedType);
    console.log('선택된 옵션:', selectedOption);
  }, [questionType, selectedOption]);

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

  useEffect(() => {
    if (frameRef.current) {
      frameRef.current.classList.remove('opacity-0');
      frameRef.current.classList.add('opacity-100');
    }
    return () => {
      if (frameRef.current) {
        frameRef.current.classList.remove('opacity-100');
        frameRef.current.classList.add('opacity-0');
      }
    };
  }, [question]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isSubmitted && selectedOption) {
          onSubmit();
        } else if (isSubmitted) {
          onNext();
        }
      }
    };
    const ref = frameRef.current;
    if (ref) ref.addEventListener('keydown', handleKeyDown);
    return () => {
      if (ref) ref.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitted, selectedOption, onSubmit, onNext]);

  // OX 문제 렌더링
  const renderOXQuestion = () => {
    return (
      <div className='flex gap-6 justify-center h-full'>
        {['O', 'X'].map((option) => {
          let optionStyle = 'border-gray-200';
          let textStyle = '';
          if (isSubmitted) {
            if (selectedOption === option && option === answerIndex) {
              optionStyle = 'border-[#009d77]/20 bg-[#009d77]/10 py-3 border-2';
              textStyle = 'font-base';
            } else if (selectedOption === option) {
              optionStyle = 'border-[#ff4339]/20 bg-[#ff4339]/10 py-3 border-2';
              textStyle = 'font-base';
            } else if (option === answerIndex) {
              optionStyle = 'border-[#009d77]/20 bg-[#009d77]/10 py-3 border-2';
              textStyle = 'font-base';
            }
          } else if (selectedOption === option) {
            optionStyle = 'border-[#754AFF]/20 bg-[#754AFF]/10 py-3 border-2';
            textStyle = 'font-base';
          }
          return (
            <div
              key={option}
              onClick={() => !isSubmitted && onSelect(option)}
              className={`w-full border-1 rounded-3xl cursor-pointer transition-colors flex items-center justify-center text-9xl font-base ${optionStyle}`}
            >
              <span className={textStyle}>{option}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // 객관식 문제 렌더링
  const renderMultipleChoice = () => {
    return (
      <div className='space-y-3 mb-2'>
        {options.map((option, index) => {
          let optionStyle = 'border-gray-200 py-3';
          let textStyle = 'flex items-center';
          if (isSubmitted) {
            if ((index + 1).toString() === answerIndex) {
              optionStyle = 'border-[#009d77]/20 bg-[#009d77]/10 py-3';
              textStyle = 'font-bold';
            } else if (selectedOption === (index + 1).toString()) {
              optionStyle = 'border-[#ff4339]/20 bg-[#ff4339]/10 py-3';
              textStyle = 'font-bold';
            }
          } else if (selectedOption === (index + 1).toString()) {
            optionStyle = 'border-[#754AFF]/20 bg-[#754AFF]/10 py-3';
            textStyle = 'font-bold';
          }
          return (
            <div
              key={index}
              onClick={() => !isSubmitted && onSelect((index + 1).toString())}
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
  };

  // 주관식 문제 렌더링
  const renderShortAnswer = () => {
    return (
      <div className='mb-2'>
        <input
          type='text'
          className='w-full p-4 border-1 rounded-2xl border-gray-200'
          placeholder='답을 입력하세요'
          value={selectedOption || ''}
          readOnly={isSubmitted}
          onChange={(e) => onSelect(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isSubmitted) {
              onSubmit();
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        />
      </div>
    );
  };

  // 문제 유형에 따른 렌더링
  const renderQuestion = () => {
    const convertedType = convertQuestionType(questionType || '');
    switch (convertedType) {
      case 'oxAns':
        return renderOXQuestion();
      case 'shortAns':
        return renderShortAnswer();
      case 'choiceAns':
      default:
        return renderMultipleChoice();
    }
  };

  // 정답 표시 렌더링 (shortAns만)
  const renderAnswer = () => {
    const convertedType = convertQuestionType(questionType || '');
    if (
      !isSubmitted ||
      convertedType !== 'shortAns' ||
      isCorrect === undefined ||
      isCorrect === null
    )
      return null;
    let bg = 'bg-[#009d77]/10 border-[#009d77]/20 text-[#009d77]';
    let border = 'border';
    let text = '정답';
    if (isCorrect === false) {
      bg = 'bg-[#ff4339]/10 border-[#ff4339]/20 text-[#ff4339]';
      text = '오답';
    }
    return (
      <div className={`mt-2 ${bg} ${border} rounded-xl p-4 text-sm`}>
        {text}: <span className='font-bold'>{answerIndex}</span>
      </div>
    );
  };

  return (
    <div
      ref={frameRef}
      tabIndex={0}
      className='w-full h-full min-h-0 bg-white rounded-3xl p-6 shadow-sm flex flex-col'
    >
      <div className='flex-shrink-0 mb-2'>
        {/* 문제 번호 */}
        <div className='flex items-center justify-between'>
          <p className='text-base font-bold'>
            문제 {currentNumber}/{totalNumber}
          </p>
          {!isSubmitted ? (
            <Button
              onClick={onSubmit}
              disabled={selectedOption === null}
              variant='basic'
            >
              제출
            </Button>
          ) : (
            <Button onClick={onNext} variant='basic'>
              다음
            </Button>
          )}
        </div>
      </div>
      <div className='flex-1 min-h-0 flex flex-col'>
        {/* 문제 내용 */}
        <div className='mb-6'>
          <h2 className='text-lg font-bold'>{question}</h2>
        </div>
        {/* 문제 유형에 따른 렌더링 */}
        {renderQuestion()}
        {/* 해설: shortAns는 정답 칸이 렌더링될 때만, 나머지는 제출 후 바로 */}
        {(() => {
          const convertedType = convertQuestionType(questionType || '');
          if (convertedType === 'shortAns') {
            return (
              renderAnswer() && (
                <SimpleBar
                  className='my-6 bg-[#CAC7FC]/20 rounded-3xl max-h-52 flex flex-col p-6'
                  style={{ opacity: 1 }}
                >
                  <div className='font-semibold mb-2 text-gray-700'>해설</div>
                  <div className='text-gray-700'>{explanation}</div>
                </SimpleBar>
              )
            );
          } else {
            return (
              isSubmitted && (
                <SimpleBar
                  className='my-6 bg-[#CAC7FC]/20 rounded-3xl max-h-52 flex flex-col p-6'
                  style={{ opacity: 1 }}
                >
                  <div className='font-semibold mb-2 text-gray-700'>해설</div>
                  <div className='text-gray-700'>{explanation}</div>
                </SimpleBar>
              )
            );
          }
        })()}
      </div>
    </div>
  );
}

export default QuestionFrame;
