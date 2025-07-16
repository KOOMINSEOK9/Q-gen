interface GlobalSpinnerProps {
  show: boolean;
}

export default function GlobalSpinner({ show }: GlobalSpinnerProps) {
  if (!show) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-rgba(0,0,0,0.3) transition-colors duration-300'>
      <div className='w-20 h-20 flex items-center justify-center'>
        <div className='w-20 h-20 rounded-full border-10 border-gray-300 border-t-[#B16DFF] animate-spin' />
        {/* 밝아졌다 어두워지는 효과 */}
        <div className='absolute w-16 h-16 rounded-full bg-white/30 animate-pulse pointer-events-none' />
      </div>
    </div>
  );
}
