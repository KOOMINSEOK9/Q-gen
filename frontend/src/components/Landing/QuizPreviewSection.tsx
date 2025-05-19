import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import choiceAnsImg from '@/assets/images/choiceAns.png';
import shortAnsImg from '@/assets/images/shortAns.png';
import oxAnsImg from '@/assets/images/oxAns.png';

const previewImages = [
  {
    src: choiceAnsImg,
    label: '객관식 문제',
    desc: '여러 선택지 중 정답을 고르는 문제 유형',
  },
  {
    src: shortAnsImg,
    label: '주관식 문제',
    desc: '직접 정답을 입력하는 문제 유형',
  },
  {
    src: oxAnsImg,
    label: 'OX 문제',
    desc: 'O/X로 답하는 간단한 문제 유형',
  },
];

function Arrow(props: any) {
  const { onClick, direction } = props;
  return (
    <button
      className={`absolute top-1/2 z-20 -translate-y-1/2 text-4xl flex items-center justify-center p-0 bg-transparent border-none shadow-none cursor-pointer ${direction === 'left' ? '-left-12' : '-right-12'}`}
      onClick={onClick}
      aria-label={direction === 'left' ? '이전' : '다음'}
      style={{ background: 'none' }}
    >
      {direction === 'left' ? (
        <FaChevronLeft className='text-purple-500' />
      ) : (
        <FaChevronRight className='text-purple-500' />
      )}
    </button>
  );
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: false,
  arrows: true,
  prevArrow: <Arrow direction='left' />,
  nextArrow: <Arrow direction='right' />,
  autoplay: true,
  autoplaySpeed: 2500,
};

export default function QuizPreviewSection() {
  return (
    <section className='pb-16 min-h-[420px] flex items-start scroll-snap-start bg-transparent'>
      <div className='bg-white rounded-[24px] container mx-auto px-4 py-16 md:py-20 overflow-hidden'>
        <h2 className='text-4xl font-bold text-center mb-8 mt-8 tracking-tight'>
          시험지 미리보기
        </h2>
        <div className='flex justify-center items-start min-h-[360px]'>
          <div className='relative w-full max-w-[950px]'>
            <Slider {...settings} className='w-full'>
              {previewImages.map((img, idx) => (
                <div
                  key={idx}
                  className='flex flex-col items-center justify-center relative group'
                >
                  <div className='relative w-full flex justify-center'>
                    <img
                      src={img.src}
                      alt={img.label}
                      className='w-[950px] max-w-[80vw] h-auto object-contain mx-auto rounded-2xl shadow-lg border border-gray-200 bg-gray-50 transition-all duration-300'
                    />
                    <div className='absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
                      <div className='absolute inset-0 bg-gray-900/50 rounded-2xl'></div>
                      <div className='relative z-10 flex flex-col items-center justify-center'>
                        <div className='text-3xl font-extrabold text-white mb-2 drop-shadow-lg'>
                          {img.label}
                        </div>
                        <div className='text-lg font-medium text-white drop-shadow-lg'>
                          {img.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
}
