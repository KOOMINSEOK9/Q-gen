interface GradientTitleProps {
  before?: string; // 하이라이트 앞에 올 일반 텍스트
  highlight: string; // 그라데이션 강조 텍스트
  after?: string; // 하이라이트 뒤에 올 일반 텍스트
  className?: string;
}

export default function GradientTitle({
  before = '',
  highlight,
  after = '',
  className,
}: GradientTitleProps) {
  return (
    <h2 className={`text-4xl font-extrabold flex items-end ${className ?? ''}`}>
      {before && <span className='text-black '>{before}</span>}
      <span className=' bg-gradient-to-r from-[#6D6DFF] to-[#B16DFF] text-transparent bg-clip-text px-1'>
        {highlight}
      </span>
      {after && <span className='text-black '>{after}</span>}
    </h2>
  );
}
