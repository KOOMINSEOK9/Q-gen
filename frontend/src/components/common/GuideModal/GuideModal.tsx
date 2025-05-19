// src/components/common/GuideModal/GuideModal.tsx

import { useState, useEffect } from 'react';
import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'default' | 'basic'; // 기본값은 'default'
}

interface GuideSlide {
  image: string;
  title: string;
  description: string;
}

const guideSlides: GuideSlide[] = [
  {
    image: '/images/guideImgs/Guide1.gif',
    title: '1. 문제집 생성하기',
    description:
      '버튼을 클릭해 원하는 주제로 문제집을 만들어 주세요. \n 그 안에서 시험지들을 관리할 수 있습니다.',
  },
  {
    image: '/images/guideImgs/Guide2.gif',
    title: '2. 문제집으로 들어가 시험지 생성을 클릭',
    description:
      '생성한 문제집을 클릭한 후, "새 시험지 만들기"를 클릭해 \n 시험지 생성 페이지로 이동합니다.',
  },
  {
    image: '/images/guideImgs/Guide3.gif',
    title: '3. 시험지명을 입력하고 업로드할 공부자료를 첨부하기',
    description: '문제를 출력하고 싶은 주제의 공부자료를 업로드 합니다.',
  },
  {
    image: '/images/guideImgs/Guide4.gif',
    title: '4. 문제 유형을 선택 후 생성하기',
    description:
      '문제 유형을 선택하고, 문제 생성을 진행해주세요. \n AI가 RAG 기반으로 정밀한 문제를 생성합니다. \n ※ 생성은 최대 1분까지 소요될 수 있어요 ※',
  },
  {
    image: '/images/guideImgs/Guide5.gif',
    title: '5. 시험지 생성 및 완료',
    description: '시험지 생성이 완료되면, \n 생성된 시험지가 나타나요!',
  },
  {
    image: '/images/guideImgs/Guide6.gif',
    title: '6. 문제도 풀고, 이력보며 복습하기',
    description:
      '이제 직접 문제를 풀어보고,\n 풀이 기록과 학습 이력을 체계적으로 관리할 수 있습니다.',
  },
];

export default function GuideModal({
  isOpen,
  onClose,
  mode = 'default',
}: GuideModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const shouldShow = localStorage.getItem('showGuideModal');
    if (shouldShow === 'false') {
      onClose();
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('showGuideModal', 'false');
    }
    onClose();
  };

  const handlePrevSlide = () => {
    if (currentSlide === 0) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentSlide((prev) => prev - 1);
      setIsFading(false);
    }, 300);
  };

  const handleNextSlide = () => {
    if (currentSlide === guideSlides.length - 1) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentSlide((prev) => prev + 1);
      setIsFading(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={handleClose} />
      <div className='relative bg-white rounded-2xl w-[90%] max-w-[600px] py-8 px-12 flex flex-col items-center shadow-lg z-10'>
        <button
          onClick={handleClose}
          className='absolute right-4 top-4 p-1 rounded-full cursor-pointer'
        >
          <IconBox name='x' size={30} className='text-gray-400' />
        </button>

        <h2 className='flex items-center gap-3 text-3xl font-bold mb-6'>
          <img src='/images/logo-lg.png' alt='로고' className='h-10' />
          문제 생성 Guide
        </h2>

        {/* 슬라이드 컨테이너 */}
        <div className='relative w-full mb-6'>
          <div className='relative min-h-[400px]'>
            {guideSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center transition-opacity duration-300 ${
                  currentSlide === index
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className='w-full mb-4'>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className='w-full h-full object-contain rounded-lg'
                  />
                </div>
                <div className='min-h-[100px] flex flex-col justify-start items-center'>
                  <h3 className='text-lg font-semibold mb-2'>{slide.title}</h3>
                  <p className='text-gray-600 text-center'>
                    {slide.description.split('\n').map((line, idx) => (
                      <span key={idx}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 네비게이션 버튼 */}
          <button
            onClick={handlePrevSlide}
            disabled={isFading || currentSlide === 0}
            className='absolute left-[-24px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <IconBox
              name='chevronDown'
              size={30}
              rotate={90}
              className='text-gray-600 opacity-50'
            />
          </button>
          <button
            onClick={handleNextSlide}
            disabled={isFading || currentSlide === guideSlides.length - 1}
            className='absolute right-[-24px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <IconBox
              name='chevronDown'
              size={30}
              rotate={-90}
              className='text-gray-600 opacity-50'
            />
          </button>

          {/* 슬라이드 인디케이터 */}
          <div className='flex justify-center gap-2 mt-4'>
            {guideSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isFading) {
                    setIsFading(true);
                    setTimeout(() => {
                      setCurrentSlide(index);
                      setIsFading(false);
                    }, 300);
                  }
                }}
                disabled={isFading}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-purple-500' : 'bg-gray-300'
                } ${isFading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </div>

        {mode !== 'basic' && (
          <div className='flex flex-col gap-2 mb-6'>
            <div className='flex items-center justify-center gap-2 '>
              <div
                onClick={() => setDontShowAgain(!dontShowAgain)}
                className='relative w-5 h-5 cursor-pointer flex-shrink-0'
              >
                <div
                  className={`absolute inset-0 rounded border-2 transition-colors duration-200
                  ${
                    dontShowAgain
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 hover:border-purple-300'
                  }`}
                />
                {dontShowAgain && (
                  <IconBox
                    name='checkW'
                    size={16}
                    className='absolute inset-0 m-auto text-white'
                  />
                )}
              </div>
              <label
                htmlFor='dontShowAgain'
                className='text-sm text-gray-600 cursor-pointer'
                onClick={() => setDontShowAgain(!dontShowAgain)}
              >
                다음에 다시 보지 않기
              </label>
            </div>
            <p className='text-xs text-gray-600'>
              다시 보고 싶다면 오른쪽 하단의 '? 버튼'을 눌러 확인할 수 있어요😆
            </p>
          </div>
        )}
        <Button variant='filled' className='w-full' onClick={handleClose}>
          확인
        </Button>
      </div>
    </div>
  );
}
