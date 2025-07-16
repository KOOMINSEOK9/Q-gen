import { useEffect, useState } from 'react';
import Button from '@/components/common/Button/Button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import confetti from 'canvas-confetti';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/apis/axiosInstance';

const QuizEnd = () => {
  const navigate = useNavigate();
  const { testPaperId } = useParams();
  const [workBookId, setWorkBookId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 왼쪽 아래에서 오른쪽 위 대각선(중앙)
    confetti({
      particleCount: 80,
      angle: 45, // 오른쪽 위 대각선
      spread: 35,
      startVelocity: 90,
      origin: { x: 0, y: 1 },
    });
    // 오른쪽 아래에서 왼쪽 위 대각선(중앙)
    confetti({
      particleCount: 80,
      angle: 135, // 왼쪽 위 대각선
      spread: 35,
      startVelocity: 90,
      origin: { x: 1, y: 1 },
    });
  }, []);

  useEffect(() => {
    // testPaperId로 workBookId 조회
    const fetchWorkBookId = async () => {
      if (!testPaperId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(
          `/api/testpaper/${testPaperId}/workbook`
        );
        if (res.data && res.data.success && res.data.data) {
          setWorkBookId(res.data.data);
        } else {
          setError(res.data?.message || '문제집 ID를 불러오지 못했습니다.');
        }
      } catch (e) {
        setError('문제집 ID를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkBookId();
  }, [testPaperId]);

  return (
    <div className='w-full'>
      <div className='w-full flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl shadow-sm p-10 animate-fade-in'>
        <div className='mb-2 w-48 h-48 flex items-center justify-center'>
          <DotLottieReact
            src='https://lottie.host/5851c0d5-f978-414e-8d73-8403cb8cded5/XJR5Ma7DBl.lottie'
            autoplay
            style={{ width: 150, height: 150 }}
            speed={1.7}
          />
        </div>
        <h2 className='text-3xl font-extrabold text-[#754AFF] mb-4 tracking-tight text-center'>
          연습문제를 모두 풀었어요!
        </h2>
        <p className='text-lg text-gray-700 mb-8 text-center max-w-md'>
          수고하셨습니다!
          <br />
          이제 시험지 리스트로 이동해서 다른 문제도 도전해보세요.
        </p>
        <Button
          onClick={() => workBookId && navigate(`/list/${workBookId}`)}
          variant='filled'
          disabled={loading || !workBookId}
        >
          시험지 리스트로 이동
        </Button>
        {loading && (
          <div className='mt-4 text-gray-400'>문제집 정보를 불러오는 중...</div>
        )}
        {error && <div className='mt-4 text-red-500'>{error}</div>}
      </div>
    </div>
  );
};

export default QuizEnd;
