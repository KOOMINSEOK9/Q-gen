import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionFrame from './QuestionFrame';
import ExamSidebar from './ExamSidebar';
import {
  getTestQuestion,
  getTestIdList,
  submitAnswer,
} from '../../apis/quiz/quiz';
import { TestQuestion, TestResult } from '../../types/quiz';
import QuizEnd from './QuizEnd';
import SimpleBar from 'simplebar-react';

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
        setIsLoading(false);
      }
    };
    fetchProblemIds();
  }, [numericTestPaperId]);

  // 단일 문제 조회 API 호출 (문제 ID 배열 기반)
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!problemIds.length) return;
      try {
        // setIsLoading(true);                      [다음] 버튼 클릭 시, 리랜더링되는 코드
        const response = await getTestQuestion(problemIds[current]);
        setCurrentQuestion(response.data);
        setIsLoading(false);
      } catch (error) {
        setCurrentQuestion(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestion();
  }, [current, problemIds]);

  useEffect(() => {
    // QuizEnd에서 사용할 Lottie 파일을 미리 fetch해서 캐시에 올려둔다
    fetch(
      'https://lottie.host/5851c0d5-f978-414e-8d73-8403cb8cded5/XJR5Ma7DBl.lottie'
    );
  }, []);

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
    return <div>문제를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className='flex gap-4 h-full min-h-0'>
      <div style={{ flex: 4 }} className='flex flex-col h-full min-h-0'>
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
          isCorrect={resultArr[current]?.correct}
          explanationBox={currentQuestion?.explanation}
        />
      </div>
      <div style={{ flex: 1 }} className='flex flex-col h-full min-h-0'>
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
