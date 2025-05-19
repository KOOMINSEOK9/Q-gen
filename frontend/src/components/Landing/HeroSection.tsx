import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className='relative min-h-[80vh] flex flex-col items-center justify-center text-center py-24 md:py-32 scroll-snap-start'>
      {/* 배경 GIF가 들어갈 자리 */}
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none select-none'>
        {/* 여기에 AI로 만든 GIF가 들어갈 예정 */}
      </div>

      {/* 메인 컨텐츠 */}
      <div className='relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto'>
        <h1 className='text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text leading-tight'>
          AI가 만드는 나만의 시험지
        </h1>
        <p className='text-lg md:text-2xl text-gray-700 mb-10 md:mb-12'>
          파일만 올리면 AI가 자동으로 문제를 생성!
          <br className='hidden md:block' />
          오답노트, PDF 변환, 복습까지 한 번에.
        </p>
        <Button
          onClick={() => navigate('/list')}
          variant='filled'
          className='px-10 py-4 text-lg md:text-xl shadow-lg hover:shadow-xl'
        >
          시작하기
        </Button>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10'>
        <svg
          className='w-6 h-6 text-gray-400'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path d='M19 14l-7 7m0 0l-7-7m7 7V3'></path>
        </svg>
      </div>
    </section>
  );
}
