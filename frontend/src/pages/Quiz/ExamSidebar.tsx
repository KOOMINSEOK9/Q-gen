import QuestionList from './QuestionList';
import ExamInfo from '../../components/ExamInfo/ExamInfo';

type AnswerStatus = 'none' | 'correct' | 'wrong';

interface ExamSidebarProps {
  currentNumber: number;
  totalQuestions: number;
  answeredQuestions: number;
  answerStatus: AnswerStatus[];
  mode: string;
  onQuestionClick: (questionNumber: number) => void;
}

function ExamSidebar({
  currentNumber,
  totalQuestions,
  answeredQuestions,
  answerStatus,
  mode,
  onQuestionClick,
}: ExamSidebarProps) {
  return (
    <div className='flex flex-col h-full min-h-0 gap-4'>
      <QuestionList
        currentNumber={currentNumber}
        totalQuestions={totalQuestions}
        answerStatus={answerStatus}
        onQuestionClick={onQuestionClick}
      />
      <ExamInfo
        totalQuestions={totalQuestions}
        answeredQuestions={answeredQuestions}
        mode={mode}
      />
    </div>
  );
}

export default ExamSidebar;
