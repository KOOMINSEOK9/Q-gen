import React from 'react';
import { FaRegLightbulb, FaRegEdit, FaFilePdf } from 'react-icons/fa';

const features = [
  {
    icon: <FaRegLightbulb size={48} className='text-purple-500' />,
    title: '나만의 시험지 생성',
    desc: '파일만 올리면 AI가 자동으로 시험지를 만들어줘요.',
    image: 'src/assets/images/creating.png',
  },
  {
    icon: <FaRegEdit size={48} className='text-blue-500' />,
    title: '오답노트 & 복습',
    desc: '틀린 문제는 자동으로 오답노트에 저장,\n반복 학습이 가능해요.',
    image: 'src/assets/images/note.png',
  },
  {
    icon: <FaFilePdf size={48} className='text-red-500' />,
    title: '내 시험지 PDF 변환',
    desc: '생성한 시험지를 PDF 파일로 변환해\n언제 어디서나 인쇄하거나 공유할 수 있어요.',
    image: 'src/assets/images/pdf.png',
  },
];

export default function FeatureSection() {
  return (
    <section className='py-20 min-h-[80vh] flex items-center scroll-snap-start'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-16'>주요 기능</h2>
        {/* 텍스트 3개 한 줄 */}
        <div className='grid grid-cols-3 gap-12 max-md:grid-cols-1 max-md:gap-8 mb-12'>
          {features.map((f, i) => (
            <div key={i} className='flex flex-col items-center text-center'>
              <div className='mb-4'>{f.icon}</div>
              <h3 className='text-2xl font-semibold mb-2 text-gray-800'>
                {f.title}
              </h3>
              <p className='text-gray-600 text-base leading-relaxed whitespace-pre-line'>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        {/* 이미지 3개 한 줄 */}
        <div className='grid grid-cols-3 gap-12 max-md:grid-cols-1 max-md:gap-8'>
          {features.map((f, i) => (
            <div key={i} className='flex items-center justify-center'>
              <div className='w-[420px] h-[270px] bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-2 flex items-center justify-center border border-white/30'>
                {f.image ? (
                  <img
                    src={f.image}
                    alt={f.title}
                    className='w-full h-full max-w-none max-h-[290px] object-contain rounded-xl'
                  />
                ) : (
                  f.icon
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
