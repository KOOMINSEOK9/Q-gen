import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
  FaTimes,
  FaPen,
} from 'react-icons/fa';

const quizExamples = [
  {
    type: '객관식',
    question: '다음 중 컴퓨터의 5대 구성 요소에 해당하지 않는 것은?',
    choices: ['입력장치', '제어장치', '연산장치', '프린터'],
    answer: '프린터',
  },
  {
    type: 'OX',
    question: 'TCP는 신뢰성 있는 데이터 전송을 보장한다.',
    answer: 'O',
  },
  {
    type: '주관식',
    question: 'OSI 7계층 중 4번째 계층의 이름을 한글로 쓰세요.',
    answer: '전송 계층',
  },
  {
    type: '객관식',
    question: '데이터베이스의 무결성(Integrity) 설명으로 옳지 않은 것은?',
    choices: ['정확성 보장', '일관성 유지', '보안성 강화', '중복 허용'],
    answer: '중복 허용',
  },
  {
    type: 'OX',
    question: 'UDP는 흐름제어와 혼잡제어를 지원한다.',
    answer: 'X',
  },
];

function Arrow(props: any) {
  const { className, style, onClick, direction } = props;
  return (
    <button
      className={`absolute top-1/2 z-10 -translate-y-1/2 bg-white/80 border border-gray-200 rounded-full p-2 shadow hover:bg-purple-100 transition-colors ${direction === 'left' ? 'left-0' : 'right-0'}`}
      style={{ ...style }}
      onClick={onClick}
      aria-label={direction === 'left' ? '이전' : '다음'}
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
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <Arrow direction='right' />,
  prevArrow: <Arrow direction='left' />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

function renderQuizCard(quiz: any, idx: number) {
  return (
    <div
      key={idx}
      className='px-4'
      data-aos='fade-up'
      data-aos-delay={idx * 100}
    >
      <div className='bg-white rounded-2xl shadow border border-gray-200 p-8 w-full max-w-xs mx-auto flex flex-col justify-between min-h-[340px] h-[340px] items-center'>
        {/* 유형 표시 */}
        <div className='flex items-center gap-2 mb-2 text-sm text-purple-500 font-semibold'>
          {quiz.type === '객관식' && <FaPen />}
          {quiz.type === 'OX' &&
            (quiz.answer === 'O' ? <FaCheck /> : <FaTimes />)}
          {quiz.type} 문제
        </div>
        {/* 문제 */}
        <div className='mb-4 text-lg font-semibold text-gray-800 text-center'>
          {quiz.question}
        </div>
        {/* 보기/입력란 */}
        {quiz.type === '객관식' && (
          <ul className='mb-4 w-full'>
            {quiz.choices.map((choice: string, i: number) => (
              <li
                key={i}
                className={`py-2 px-4 rounded-lg mb-2 border text-gray-700 text-center ${choice === quiz.answer ? 'border-purple-400 bg-purple-50 font-bold' : 'border-gray-200 bg-gray-50'}`}
              >
                {choice}
              </li>
            ))}
          </ul>
        )}
        {quiz.type === '주관식' && (
          <div className='mb-4 w-full flex flex-col items-center'>
            <input
              type='text'
              className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 bg-gray-50 text-center mb-2'
              placeholder='정답을 입력해보세요'
              disabled
            />
          </div>
        )}
        {quiz.type === 'OX' && (
          <div className='mb-4 flex gap-6 justify-center'>
            {['O', 'X'].map((option) => {
              let optionStyle = 'border-gray-200 bg-white';
              let textStyle = 'text-gray-700';
              if (quiz.answer === option) {
                optionStyle = 'border-purple-400 bg-purple-50';
                textStyle = 'font-bold text-purple-600';
              }
              return (
                <div
                  key={option}
                  className={`w-[120px] h-[80px] border-2 rounded-[24px] flex items-center justify-center text-4xl transition-colors ${optionStyle}`}
                >
                  <span className={textStyle}>{option}</span>
                </div>
              );
            })}
          </div>
        )}
        {/* 정답 */}
        <div className='mt-auto text-right text-xs text-gray-400 w-full'>
          정답: <span className='font-bold text-purple-500'>{quiz.answer}</span>
        </div>
      </div>
    </div>
  );
}

export default function QuizPreviewSection() {
  return (
    <section className='py-20 bg-gray-50 min-h-[80vh] flex items-center scroll-snap-start rounded-[24px]'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-12'>퀴즈 미리보기</h2>
        <Slider {...settings} className='max-w-5xl mx-auto relative'>
          {quizExamples.map((quiz, idx) => renderQuizCard(quiz, idx))}
        </Slider>
      </div>
    </section>
  );
}
