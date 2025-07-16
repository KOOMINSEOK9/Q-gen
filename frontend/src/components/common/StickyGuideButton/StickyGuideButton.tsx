// src/components/common/StickyGuideButton.tsx

interface StickyGuideButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

export default function StickyGuideButton({
  onClick,
  ariaLabel = '가이드',
}: StickyGuideButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
          fixed bottom-8 right-8 z-50 bg-[#764EFF] border border-white rounded-full
          w-16 h-16 flex items-center justify-center shadow-lg
          hover:scale-110 hover:bg-[#764EFF] transition-all duration-300 cursor-pointer
        `}
      aria-label={ariaLabel}
      type='button'
      style={{ willChange: 'transform, background' }}
    >
      <img
        src='/images/q-dolphin.png'
        alt='가이드 돌고래'
        className='w-9 h-9 object-contain'
        draggable={false}
      />
    </button>
  );
}
