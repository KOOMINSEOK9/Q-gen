import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionFrame from '../../components/quiz/QuestionFrame/QuestionFrame';
import ExamSidebar from './ExamSidebar';
import {
  getTestQuestion,
  getTestIdList,
  submitAnswer,
} from '../../apis/quiz/quiz';
import { TestQuestion, TestResult } from '../../types/quiz';
import QuizEnd from './QuizEnd';

type AnswerStatus = 'none' | 'correct' | 'wrong';

function QuizPage() {
  const { testPaperId } = useParams();
  const numericTestPaperId = testPaperId ? Number(testPaperId) : null;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showQuizEnd, setShowQuizEnd] = useState(false); // QuizEnd 표시 여부

  // 전체 문제 ID 배열 및 문제 수
  const [problemIds, setProblemIds] = useState<number[]>([]);
  const totalQuestions = problemIds.length;

  // 문제별 상태 배열
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmittedArr, setIsSubmittedArr] = useState<boolean[]>([]);
  const [answerStatusArr, setAnswerStatusArr] = useState<AnswerStatus[]>([]);
  const [resultArr, setResultArr] = useState<(TestResult | null)[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<TestQuestion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 문제를 다 풀었는지 체크
  const isAllSolved =
    answerStatusArr.length > 0 && answerStatusArr.every((s) => s !== 'none');

  // 전체 문제 ID 배열 받아오기 및 상태 초기화
  useEffect(() => {
    const fetchProblemIds = async () => {
      if (!numericTestPaperId) {
        setError('시험지 ID가 없습니다.');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const res = await getTestIdList(numericTestPaperId);
        if (res.success && res.data) {
          setProblemIds(res.data);
          setSelectedAnswers(Array(res.data.length).fill(null));
          setIsSubmittedArr(Array(res.data.length).fill(false));
          setAnswerStatusArr(Array(res.data.length).fill('none'));
          setResultArr(Array(res.data.length).fill(null));
          setCurrent(0);
        } else {
          setError(res.message || '문제 ID 목록을 불러오지 못했습니다.');
        }
      } catch (e) {
        setError('문제 ID 목록을 불러오지 못했습니다.');
      } finally {
        console.log('문제 불러오기 완료');
      }
    };
    fetchProblemIds();
  }, [numericTestPaperId]);

  // 단일 문제 조회 API 호출 (문제 ID 배열 기반)
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!problemIds.length) return;
      try {
        const response = await getTestQuestion(problemIds[current]);
        setCurrentQuestion(response.data);
        setIsLoading(false);
        // 문제 로드 후 스크롤 최상단으로
        window.scrollTo(0, 0);
      } catch (error) {
        setCurrentQuestion(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestion();
  }, [current, problemIds]);

  const handleSelect = (value: string) => {
    if (!isSubmitted) {
      setSelected(value);
    }
  };

  const handleSubmit = async () => {
    if (selected !== null && currentQuestion) {
      try {
        setIsSubmitted(true);
        setIsSubmittedArr((prev) => {
          const updated = [...prev];
          updated[current] = true;
          return updated;
        });
        setSelectedAnswers((prev) => {
          const updated = [...prev];
          updated[current] = selected;
          return updated;
        });

        const res = await submitAnswer({
          testId: currentQuestion.testId,
          userAnswer: selected,
        });

        if (res.success && res.data) {
          setResultArr((prev) => {
            const updated = [...prev];
            updated[current] = res.data;
            if (res.data) {
              console.log('정답 correctAnswer:', res.data.correctAnswer);
            }
            return updated;
          });

          setAnswerStatusArr((prev) => {
            const updated = [...prev];
            updated[current] = res.data!.correct ? 'correct' : 'wrong';
            return updated;
          });
        } else {
          setError(res.message || '답안 제출에 실패했습니다.');
        }
      } catch (e) {
        setError('답안 제출에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNext = () => {
    if (current < totalQuestions - 1) {
      setCurrent((prev) => prev + 1);
      setSelected(selectedAnswers[current + 1] ?? null);
      setIsSubmitted(isSubmittedArr[current + 1] ?? false);
    } else {
      // 마지막 문제에서 다음 버튼 클릭 시 QuizEnd로 이동
      setShowQuizEnd(true);
    }
  };

  const handleQuestionClick = (questionNumber: number) => {
    const idx = questionNumber - 1;
    setCurrent(idx);
    setSelected(selectedAnswers[idx] ?? null);
    setIsSubmitted(isSubmittedArr[idx] ?? false);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
        <span className='ml-4 text-lg text-gray-500'>
          문제를 불러오는 중입니다...
        </span>
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500 p-4'>{error}</div>;
  }

  if (showQuizEnd) {
    return <QuizEnd />;
  }

  if (!currentQuestion) {
    console.log(currentQuestion);
    return <div>문제를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className='w-full'>
      <div className='flex gap-[40px] items-start'>
        <div className='w-[1315px]'>
          <div className='flex items-center gap-2 mb-4'>
            <img
              src='/src/assets/images/chart.png'
              alt='시험 아이콘'
              className='w-11 h-11'
            />
            <h1 className='text-2xl font-bold'>정보처리기사 필기 1회</h1>
          </div>
          <QuestionFrame
            currentNumber={current + 1}
            totalNumber={totalQuestions}
            question={currentQuestion?.question || ''}
            options={
              currentQuestion?.type === 'oxAns'
                ? ['O', 'X']
                : [
                    currentQuestion?.option1 || '',
                    currentQuestion?.option2 || '',
                    currentQuestion?.option3 || '',
                    currentQuestion?.option4 || '',
                  ]
            }
            selectedOption={selected}
            isSubmitted={isSubmitted}
            answerIndex={resultArr[current]?.correctAnswer || ''}
            explanation={resultArr[current]?.comment || ''}
            onSelect={handleSelect}
            onSubmit={handleSubmit}
            onNext={handleNext}
            questionType={
              currentQuestion?.type as 'choiceAns' | 'shortAns' | 'oxAns'
            }
          />
        </div>
        <ExamSidebar
          currentNumber={current + 1}
          totalQuestions={totalQuestions}
          answeredQuestions={answerStatusArr.filter((s) => s !== 'none').length}
          answerStatus={answerStatusArr}
          mode='연습 모드'
          onQuestionClick={handleQuestionClick}
        />
      </div>
    </div>
  );
}

export default QuizPage;
