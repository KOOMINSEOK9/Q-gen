import Button from '@/components/common/Button/Button';

type AnswerStatus = 'none' | 'correct' | 'wrong';

interface QuestionListProps {
  currentNumber: number;
  totalQuestions: number;
  answerStatus: AnswerStatus[];
  onQuestionClick: (questionNumber: number) => void;
}

function QuestionList({
  currentNumber,
  totalQuestions,
  answerStatus,
  onQuestionClick,
}: QuestionListProps) {
  return (
    <div className='h-full min-h-[0] flex flex-col bg-white rounded-3xl p-6 shadow-sm overflow-y-auto'>
      <h3 className='text-lg font-bold mb-4'>문제 목록</h3>
      <div className='grid grid-cols-5 gap-2'>
        {Array.from(
          { length: Math.min(totalQuestions, 30) },
          (_, i) => i + 1
        ).map((number) => {
          let btnClass = '';
          if (answerStatus[number - 1] === 'correct') {
            btnClass =
              'bg-[#009d77]/10 border border-[#009d77]/20 text-gray-700 hover:bg-[#009d77]/50 border hover:border-transparent';
          } else if (answerStatus[number - 1] === 'wrong') {
            btnClass =
              'bg-[#ff4339]/10 border border-[#ff4339]/20 text-gray-700 hover:bg-[#ff4339]/50 border hover:border-transparent';
          } else if (answerStatus[number - 1] !== 'none') {
            btnClass =
              'bg-[#754AFF]/10 border border-[#754AFF]/20 text-gray-700 hover:bg-[#754AFF]/50 border hover:border-transparent';
          } else {
            btnClass =
              'bg-white text-gray-700 border border-gray-200 hover:bg-[#754AFF]/50 border hover:border-transparent';
          }
          return (
            <Button
              key={number}
              onClick={() => onQuestionClick(number)}
              className={`flex items-center justify-center text-sm font-medium relative transition-colors duration-200 ease-in-out min-w-[32px] cursor-pointer p-4 md:p-2 ${
                number === currentNumber
                  ? 'bg-gradient-to-r from-[#754AFF] to-[#A34BFF] text-white shadow-sm'
                  : btnClass
              }`}
            >
              {number}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionList;
