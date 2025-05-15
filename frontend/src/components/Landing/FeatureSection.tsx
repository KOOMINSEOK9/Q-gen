import React from 'react';
import { FaRegLightbulb, FaRegEdit, FaFilePdf } from 'react-icons/fa';

const features = [
  {
    icon: <FaRegLightbulb size={48} className='text-purple-500' />,
    title: '나만의 시험지 생성',
    desc: '파일만 올리면 AI가 자동으로 시험지를 만들어줘요.',
    image: 'src/assets/images/quiz-create.png',
  },
  {
    icon: <FaRegEdit size={48} className='text-blue-500' />,
    title: '오답노트 & 복습',
    desc: '틀린 문제는 자동으로 오답노트에 저장,\n반복 학습이 가능해요.',
    image: 'src/assets/images/note-review.png',
  },
  {
    icon: <FaFilePdf size={48} className='text-red-500' />,
    title: '내 시험지 PDF 변환',
    desc: '생성한 시험지를 PDF 파일로 변환해\n언제 어디서나 인쇄하거나 공유할 수 있어요.',
    image: 'src/assets/images/pdf-download.png',
  },
];

export default function FeatureSection() {
  return (
    <section className='py-20 min-h-[80vh] flex items-center scroll-snap-start'>
      <div className='container mx-auto px-4'>
        <h2 className='text-4xl font-bold text-center mb-12'>주요 기능</h2>
        <div className='space-y-24'>
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center justify-center gap-60 max-md:flex-col max-md:gap-8`}
              data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}
            >
              {/* 이미지/아이콘 영역 */}
              <div className='w-[340px] h-[220px] flex items-center justify-center'>
                <div className='w-full h-full bg-white/40 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex items-center justify-center border border-white/30'>
                  {f.image ? (
                    <img
                      src={f.image}
                      alt={f.title}
                      className='w-full h-full object-contain'
                    />
                  ) : (
                    f.icon
                  )}
                </div>
              </div>
              {/* 텍스트 영역 */}
              <div className='max-w-[400px] flex flex-col justify-center min-h-[220px]'>
                <div className='mb-4 md:hidden flex justify-center'>
                  {f.icon}
                </div>
                <h3 className='text-3xl font-semibold mb-4 text-gray-800'>
                  {f.title}
                </h3>
                <p className='text-gray-600 text-lg'>
                  {f.desc.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i !== f.desc.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
