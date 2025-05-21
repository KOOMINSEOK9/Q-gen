// src/components/common/SortDropdown.tsx

import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}
interface SortDropdownProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export default function SortDropdown({
  value,
  options,
  onChange,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className='relative inline-block'>
      <button
        type='button'
        className='flex items-center justify-between w-[120px] px-4 py-2 rounded-full border border-gray-300 bg-white text-md cursor-pointer focus:outline-none'
        onClick={() => setOpen((v) => !v)}
      >
        {selected?.label || ''}
        {open ? (
          <FiChevronUp className='ml-2 text-xl' />
        ) : (
          <FiChevronDown className='ml-2 text-xl' />
        )}
      </button>
      {open && (
        <div className='absolute left-1/2 -translate-x-1/2 mt-2 w-[120px] bg-white border border-gray-300 rounded-3xl shadow-lg z-50 py-2'>
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`block w-full text-left px-8 py-2 text-md font-normal hover:bg-gray-100 ${
                value === opt.value ? 'font-bold' : ''
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
