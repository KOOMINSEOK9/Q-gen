// src/components/common/Tooltip.tsx
import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className='relative'
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className='absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 w-max max-w-xs px-4 py-2 bg-black text-white text-sm rounded shadow-lg whitespace-pre-line'>
          {content}
        </div>
      )}
    </span>
  );
}
