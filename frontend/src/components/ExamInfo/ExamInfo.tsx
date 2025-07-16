interface ExamInfoProps {
  totalQuestions: number;
  answeredQuestions: number;
  mode: string;
}

function ExamInfo({ totalQuestions, answeredQuestions, mode }: ExamInfoProps) {
  return (
    <div className='bg-white rounded-[24px] p-6 shadow-sm'>
      <h3 className='text-lg font-bold mb-6'>시험 정보</h3>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>총 문제 수</span>
          <span className='font-medium'>{totalQuestions}문제</span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>답변한 문제</span>
          <span className='font-medium'>
            {answeredQuestions}/{totalQuestions}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600'>모드</span>
          <span className='font-medium'>{mode}</span>
        </div>
      </div>
    </div>
  );
}

export default ExamInfo;
