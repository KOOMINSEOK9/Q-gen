// src/components/WorkBookCard/WorkBookCard.tsx

import { useRef, useEffect, useState } from 'react';
import MiniModal from '@/components/common/MiniModal/MiniModal';
import IconBox from '@/components/common/IconBox/IconBox';

interface WorkBookCardProps {
  title: string;
  date: string;
  onClick?: () => void;
  onDelete: () => void;
  onEdit: () => void;
  selectedId: number;
}

function WorkBookCard({
  title,
  date,
  onClick,
  onDelete,
  onEdit,
  selectedId,
}: WorkBookCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [modalOpen]);

  return (
    <div
      onClick={onClick}
      className='relative flex-1 h-[260px] bg-white rounded-[20px] p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow'
    >
      <div className='flex justify-between items-start'>
        <h2 className='text-xl font-bold'>{title}</h2>
        <div className='relative'>
          <div
            className='rounded-full hover:bg-[#f7f7f7] p-1 transition-colors flex items-center justify-center'
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen((prev) => !prev);
            }}
          >
            <IconBox className='transition-colors' size={20} name='colDots' />
          </div>
          {modalOpen && (
            <div ref={modalRef} className='absolute right-0 top-0 z-50'>
              <MiniModal
                isOpen={modalOpen}
                // onClose={() => setModalOpen(false)}
                actions={[
                  { text: '삭제', href: '#', onClick: onDelete },
                  { text: '이름 수정', href: '#', onClick: onEdit },
                ]}
                selectedId={selectedId}
              />
            </div>
          )}
        </div>
      </div>
      <p className='text-gray-500 text-right'>{date}</p>
    </div>
  );
}

export default WorkBookCard;
