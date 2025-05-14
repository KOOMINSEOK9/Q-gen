import React from 'react';
import { FaRegLightbulb, FaRegEdit, FaChartBar } from 'react-icons/fa';

const features = [
  {
    icon: <FaRegLightbulb size={36} className='text-purple-500' />,
    title: '직관적인 퀴즈 생성',
    desc: '간편한 UI로 누구나 쉽게 나만의 퀴즈를 만들 수 있어요.',
  },
  {
    icon: <FaRegEdit size={36} className='text-blue-500' />,
    title: '오답노트 & 복습',
    desc: '틀린 문제는 자동으로 오답노트에 저장, 반복 학습이 가능해요.',
  },
  {
    icon: <FaChartBar size={36} className='text-pink-500' />,
    title: '학습 통계 제공',
    desc: '내 학습 현황을 한눈에! 통계로 동기부여까지 챙기세요.',
  },
];

export default function FeatureSection() {
  return (
    <section className='py-20 min-h-[80vh] flex items-center scroll-snap-start'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-12'>주요 기능</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {features.map((f, i) => (
            <div
              key={i}
              className='backdrop-blur-lg bg-white/40 rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-2xl border border-white/30'
            >
              <div className='mb-4'>{f.icon}</div>
              <h3 className='text-2xl font-semibold mb-2 text-gray-800'>
                {f.title}
              </h3>
              <p className='text-gray-600 text-center text-base'>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
