import { useRef, useEffect, useState } from 'react';

export default function ScrollingEllipsis({ children }: { children: string }) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (outerRef.current && innerRef.current) {
      const outerWidth = outerRef.current.offsetWidth;
      const innerWidth = innerRef.current.scrollWidth;
      innerRef.current.style.setProperty('--scroll-width', innerWidth + 'px');
      setShouldScroll(innerWidth > outerWidth);
    }
  }, [children]);

  return (
    <span ref={outerRef} className='scrolling-ellipsis w-full' title={children}>
      <span
        ref={innerRef}
        className='scrolling-ellipsis-inner'
        style={{
          // 스크롤이 필요 없으면 transform 적용 안 함
          transition: shouldScroll ? undefined : 'none',
        }}
      >
        {children}
      </span>
    </span>
  );
}
