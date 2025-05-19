import React from 'react';
import choiceAnsImg from '@/assets/images/choiceAns.png';
import notePng from '@/assets/images/note.png';
import pdfImg from '@/assets/images/oxAns.png';
import createImg from '@/assets/images/create.png';

const features = [
  {
    title: 'AI 자동 시험지 생성',
    desc: '파일만 올리면 AI가 자동으로 문제를 만들어줘요.',
    image: choiceAnsImg,
  },
  {
    title: '오답노트 & 복습',
    desc: '틀린 문제는 자동으로 <br />오답노트에 저장, 반복 복습이 가능해요.',
    image: notePng,
  },
  {
    title: 'PDF 변환/다운로드',
    desc: '생성한 시험지를 PDF로 변환해 <br />언제 어디서나 인쇄하거나 공유할 수 있어요.',
    image: pdfImg,
  },
];

export default function FeatureSection() {
  return (
    <section className='w-full py-0 flex justify-center'>
      <div className='container mx-auto px-4 pt-0 pb-16 md:pt-0 md:pb-20 overflow-hidden'>
        <h2 className='text-4xl font-extrabold text-center mb-20'>핵심 기능</h2>
        <div className='flex flex-col gap-24'>
          {features.map((f, i) => (
            <div
              key={i}
              className={`w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:justify-center gap-12 md:gap-24 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {i === 2 ? (
                <div className='flex justify-center w-full md:w-1/2 relative'>
                  <img
                    src={createImg}
                    alt='pdf'
                    className='w-[464px] h-[265px] rounded-2xl shadow-lg object-contain bg-white'
                    style={{ display: 'block' }}
                  />
                  {/* 모달 오버레이 */}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='bg-white rounded-2xl shadow-lg p-2 w-[180px] max-w-full flex flex-col items-center border border-gray-100 animate-[fadeInScale_3s_ease-in-out_infinite_1.5s]'>
                      <div className='w-full flex justify-between items-center mb-2'>
                        <span className='text-[9px] font-bold'>
                          어떻게 변환할까요?
                        </span>
                        <span className='text-base text-gray-400 cursor-pointer'>
                          ×
                        </span>
                      </div>
                      <button className='w-full py-1 mb-1 rounded-xl border border-purple-200 bg-purple-50 text-purple-600 font-bold text-[9px]'>
                        문제만
                      </button>
                      <button className='w-full py-1 mb-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-[9px]'>
                        정답/해설포함
                      </button>
                      <button className='w-full py-1 rounded-xl bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold text-[9px] shadow'>
                        PDF 다운로드
                      </button>
                    </div>
                  </div>
                </div>
              ) : i === 1 ? (
                <div
                  className={`flex justify-center w-full md:w-auto md:mr-12 md:translate-x-16 relative`}
                >
                  <img
                    src={f.image}
                    alt={f.title}
                    className={`h-[260px] w-auto max-w-[520px] object-contain rounded-2xl shadow-lg`}
                    style={{ display: 'block' }}
                  />
                  <div className='absolute bottom-4 right-4'>
                    <svg
                      className='text-green-400 text-4xl animate-[fadeInScale_2.5s_ease-in-out_infinite]'
                      width='40'
                      height='40'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </div>
              ) : i === 0 ? (
                <div className='flex justify-center w-full md:w-1/2 relative'>
                  <img
                    src={createImg}
                    alt='creating'
                    className='w-[464px] h-[265px] rounded-2xl shadow-lg object-contain bg-white'
                    style={{ display: 'block' }}
                  />
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span
                      className='text-xl md:text-2xl font-semibold text-purple-400 animate-pulse'
                      style={{ textShadow: '0 1px 8px #fff' }}
                    >
                      Creating...
                    </span>
                  </div>
                </div>
              ) : (
                <div className={`flex justify-center w-full md:w-1/2`}>
                  <img
                    src={f.image}
                    alt={f.title}
                    className='w-[320px] md:w-[420px] rounded-2xl shadow-lg'
                    style={{ display: 'block' }}
                  />
                </div>
              )}
              <div
                className={`flex flex-col justify-center items-start text-left w-full md:w-1/2 ${i === 1 ? 'md:pl-12' : ''}`}
              >
                <h3 className='text-2xl md:text-3xl font-bold mb-4 mt-0'>
                  {f.title}
                </h3>
                <p
                  className='text-lg md:text-xl text-gray-600'
                  dangerouslySetInnerHTML={{ __html: f.desc }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
