import type { PropsWithChildren } from 'react';

interface BackgroundProps extends PropsWithChildren {}

function Background({ children }: BackgroundProps) {
  return (
    <div className='relative bg-[#F9F5FF] p-4'>
      <div className='pointer-events-none'>
        <img
          src='/src/assets/images/left-arc.png'
          alt=''
          className='fixed left-0 bottom-[20%] w-[40vw] z-0'
        />
        <img
          src='/src/assets/images/right-arc.png'
          alt=''
          className='fixed right-0 top-0 w-[25vw] z-0'
        />
      </div>
      <div className='relative w-full z-10'>{children}</div>
    </div>
  );
}

export default Background;
