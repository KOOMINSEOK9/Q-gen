import { useState, useRef } from 'react';

export default function Footer() {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   if (contentRef.current) {
  //     if (expanded) {
  //       setMaxHeight(contentRef.current.scrollHeight + "px");
  //     } else {
  //       setMaxHeight("0px");
  //     }
  //   }
  // }, [expanded]);

  return (
    <footer
      ref={contentRef}
      className={`w-full relative overflow-hidden transition-all duration-500 ease-in-out rounded-3xl px-12 shadow-[0_0_24px_0_rgba(0,0,0,0.12)] ${
        expanded ? 'bg-black text-white py-12' : 'bg-white text-black py-8'
      }`}
    >
      <div
        className={`flex flex-col  transition-opacity duration-500 ${expanded ? 'gap-8' : ''}`}
      >
        <div className='flex justify-between '>
          {/* 왼쪽 */}
          <div>
            <div
              className={`${expanded ? 'text-7xl font-extrabold mb-6 ' : 'text-3xl font-bold mb-2'}`}
            >
              Q-gen
            </div>
            {expanded && (
              <>
                <div className='text-gray-400 text-lg mb-1'>
                  <span className='font-medium'>전화번호</span> | 070-0000-0000
                </div>
                <div className='text-gray-400 text-lg'>
                  <span className='font-medium'>이메일</span> |
                  4321rag@gmail.com
                </div>
              </>
            )}
          </div>
          {/* 오른쪽 */}
          <div className={`flex flex-col items-end ${expanded ? 'pt-14' : ''}`}>
            {expanded ? (
              <div>
                <div className='text-right font-bold text-xl mb-2'>
                  Q-gen
                  <span className='font-normal'>
                    은 시험을 준비하는 응시자와 출제자를 위한 AI 기반 학습
                    플랫폼입니다.
                  </span>
                </div>
                <div className='text-right text-gray-300 text-md mb-2'>
                  사용자가 업로드한 자료를 분석하여 개인화된 학습 콘텐츠와
                  문제를 제공합니다.
                  <br />
                  다양한 형식의 자료(PDF, 이미지, URL 등)를 업로드하고, <br />
                  나만의 문제와 시험지를 만들고 망각곡선에 기반한 오답관리로
                  자격증 공부를 준비해보세요.
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-end'>
                <button
                  className='cursor-pointer text-black text-lg flex items-center gap-1 mb-4'
                  onClick={() => setExpanded(true)}
                >
                  <span className='text-3xl'>+</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex justify-between items-center gap-8 mt-8 text-gray-400 text-base'>
          <div className='flex gap-8'>
            {/* <span>개인정보 처리방침</span>
            <span>서비스 이용약관</span>
            <span>고객센터</span> */}
          </div>
          {expanded && (
            <div className='text-gray-400 text-base'>
              @2025 Q-gen, INC.ALL RIGHTS RESERVED.
            </div>
          )}
        </div>
        {expanded && (
          <button
            className='cursor-pointer absolute right-12 top-8 text-white text-lg flex items-center gap-1'
            onClick={() => setExpanded(false)}
          >
            ㅡ
          </button>
        )}
      </div>
    </footer>
  );
}
