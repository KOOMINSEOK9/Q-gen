import { useState, useEffect, useRef } from 'react';
import Test from './Test';
import TestList from './TestList';
import Button from '@/components/common/Button/Button';
import Memo from './Memo';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {
  getNoteTestPapers,
  getNoteTestIdList,
  getNoteTestDetail,
} from '@/apis/note/note';
import type { TestPaper, NoteTestDetail } from '@/types/note';
import { useParams, useNavigate } from 'react-router-dom';

const Note = () => {
  const { workBookId, testPaperId } = useParams();
  const navigate = useNavigate();
  const [currentNumber, setCurrentNumber] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testPapers, setTestPapers] = useState<TestPaper[]>([]);
  const [activeTestPaperIndex, setActiveTestPaperIndex] = useState(0);
  const [testIdList, setTestIdList] = useState<number[]>([]);
  const [currentTestDetail, setCurrentTestDetail] =
    useState<NoteTestDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testDetails, setTestDetails] = useState<NoteTestDetail[]>([]);
  const simpleBarRef = useRef<any>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 시험지 목록 불러오기
  useEffect(() => {
    const fetchTestPapers = async () => {
      try {
        const res = await getNoteTestPapers(Number(workBookId));
        setTestPapers(res.data.reverse());
      } catch (e) {
        setTestPapers([]);
        setError('시험지 목록을 불러오지 못했습니다.');
      }
    };
    fetchTestPapers();
  }, []);

  // 시험지 목록 불러온 후, testPaperId에 맞는 시험지 자동 선택
  useEffect(() => {
    if (!testPapers.length || !testPaperId) return;
    const idx = testPapers.findIndex(
      (paper) => String(paper.testPaperId) === String(testPaperId)
    );
    if (idx !== -1) setActiveTestPaperIndex(idx);
  }, [testPapers, testPaperId]);

  // 시험지 선택 시 문제 ID 리스트 불러오기
  useEffect(() => {
    if (testPapers.length === 0) return;
    const fetchTestIdList = async () => {
      setLoading(true);
      try {
        const ids = await getNoteTestIdList(
          testPapers[activeTestPaperIndex].testPaperId
        );
        setTestIdList(ids);
        setCurrentNumber(1); // 시험지 바뀌면 1번 문제로 초기화
        // Fetch all details in parallel
        const details = await Promise.all(
          ids.map((id) => getNoteTestDetail(id).then((res) => res.data))
        );
        setTestDetails(details);
      } catch (e) {
        setTestIdList([]);
        setTestDetails([]);
        setError('문제 ID 리스트를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchTestIdList();
  }, [testPapers, activeTestPaperIndex]);

  // 문제 번호 변경 시 문제 상세 불러오기 (이제 캐시 사용)
  useEffect(() => {
    if (testDetails.length === 0) return;
    setCurrentTestDetail(testDetails[currentNumber - 1] || null);
  }, [testDetails, currentNumber]);

  useEffect(() => {
    if (buttonRefs.current[activeTestPaperIndex]) {
      buttonRefs.current[activeTestPaperIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'auto',
      });
    }
  }, [activeTestPaperIndex, testPapers.length]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    setCurrentNumber((prev) => Math.min(prev + 1, testIdList.length));
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handlePrev = () => {
    setCurrentNumber((prev) => Math.max(prev - 1, 1));
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleTestClick = (testNumber: number) => {
    setCurrentNumber(testNumber);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const totalTests = testIdList.length;

  return (
    <div className='flex gap-4 h-full'>
      {/* TestList (1/5) */}
      <div style={{ flex: 1 }} className='flex flex-col gap-4 h-full min-h-0'>
        <div className='bg-white rounded-3xl py-6 shadow-sm h-full min-h-0 flex flex-col'>
          <h3 className='text-lg font-bold px-6 mb-4'>내가 푼 시험지 List</h3>
          <SimpleBar
            style={{ flex: 1, height: '100%', minHeight: 0 }}
            ref={simpleBarRef}
          >
            <div className='flex flex-col gap-3 px-6'>
              {testPapers.map((exam, idx) => (
                <Button
                  key={exam.testPaperId}
                  ref={(el) => {
                    if (el) {
                      buttonRefs.current[idx] = el;
                    }
                  }}
                  variant='filled'
                  className={`w-full py-3 px-6 rounded-2xl transition-colors${idx === activeTestPaperIndex ? '' : ' bg-white border-1 border-gray-200 text-gray-900 hover:bg-[#754AFF]/10 hover:border-transparent'}`}
                  onClick={() => {
                    setActiveTestPaperIndex(idx);
                    navigate(`/note/${workBookId}/${exam.testPaperId}`);
                  }}
                >
                  {exam.title}
                </Button>
              ))}
            </div>
          </SimpleBar>
        </div>

        <div className='bg-white rounded-3xl p-6 shadow-sm'>
          <TestList
            currentNumber={currentNumber}
            totalTests={totalTests}
            onTestClick={handleTestClick}
            testDetails={testDetails}
          />
        </div>
      </div>

      {/* Test (3/5) */}
      <div style={{ flex: 2.8 }} className='flex flex-col h-full min-h-0'>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            불러오는 중...
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full text-red-500'>
            {error}
          </div>
        ) : currentTestDetail ? (
          (() => {
            function convertType(
              type: string
            ): 'choiceAns' | 'shortAns' | 'oxAns' {
              switch (type) {
                case 'TYPE_CHOICE':
                  return 'choiceAns';
                case 'TYPE_SHORT':
                  return 'shortAns';
                case 'TYPE_OX':
                  return 'oxAns';
                default:
                  return 'choiceAns';
              }
            }

            const rawType = currentTestDetail.type;
            const type = convertType(rawType);
            const { answer, testHistoryList } = currentTestDetail;
            let options: string[] = [];
            let answerIndex: any = null;
            let selectedOption: any = null;

            if (type === 'choiceAns') {
              options = [
                currentTestDetail.option1,
                currentTestDetail.option2,
                currentTestDetail.option3,
                currentTestDetail.option4,
              ].filter(Boolean) as string[];
              if (
                answer &&
                /^\d+$/.test(answer.trim()) &&
                Number(answer) >= 1 &&
                Number(answer) <= options.length
              ) {
                answerIndex = Number(answer) - 1;
              } else {
                answerIndex = options.findIndex((opt) => opt === answer);
              }
              const lastHistory = testHistoryList?.slice(-1)[0];
              if (lastHistory) {
                if (
                  lastHistory.userAnswer &&
                  /^\d+$/.test(lastHistory.userAnswer.trim()) &&
                  Number(lastHistory.userAnswer) >= 1 &&
                  Number(lastHistory.userAnswer) <= options.length
                ) {
                  selectedOption = Number(lastHistory.userAnswer) - 1;
                } else {
                  selectedOption = options.findIndex(
                    (opt) => opt === lastHistory.userAnswer
                  );
                }
              }
            } else if (type === 'oxAns') {
              options = ['O', 'X'];
              answerIndex = answer === 'O' ? 0 : 1;
              const lastHistory = testHistoryList?.slice(-1)[0];
              selectedOption = lastHistory
                ? lastHistory.userAnswer === 'O'
                  ? 0
                  : 1
                : null;
            } else if (type === 'shortAns') {
              options = [];
              answerIndex = answer;
              const lastHistory = testHistoryList?.slice(-1)[0];
              selectedOption = lastHistory ? lastHistory.userAnswer : '';
            }

            const isSubmitted = !!(
              testHistoryList && testHistoryList.length > 0
            );
            // 디버깅용 로그
            console.log('[NOTE->TEST] type:', type);
            console.log('[NOTE->TEST] options:', options);
            console.log('[NOTE->TEST] answerIndex:', answerIndex);
            console.log('[NOTE->TEST] selectedOption:', selectedOption);
            console.log('[NOTE->TEST] answer:', answer);
            console.log('[NOTE->TEST] testHistoryList:', testHistoryList);
            return (
              <Test
                currentNumber={currentNumber}
                totalNumber={totalTests}
                test={currentTestDetail.question}
                options={options}
                selectedOption={selectedOption}
                isSubmitted={isSubmitted}
                answerIndex={answerIndex}
                explanation={currentTestDetail.comment}
                explanationBox={currentTestDetail.explanation}
                incorrectCount={currentTestDetail.incorrectCount}
                onNext={handleNext}
                onPrev={handlePrev}
                testHistoryList={currentTestDetail.testHistoryList}
                answer={currentTestDetail.answer}
                type={type}
              />
            );
          })()
        ) : (
          <div className='flex items-center justify-center h-full'>
            문제를 불러올 수 없습니다.
          </div>
        )}
      </div>

      {/* Note (1/5) */}
      <div style={{ flex: 1.2 }} className='flex flex-col h-full min-h-0'>
        {currentTestDetail ? (
          <Memo
            testId={currentTestDetail.testId}
            initialMemo={currentTestDetail.memo}
          />
        ) : (
          <Memo testId={0} initialMemo={null} />
        )}
      </div>
    </div>
  );
};

export default Note;
