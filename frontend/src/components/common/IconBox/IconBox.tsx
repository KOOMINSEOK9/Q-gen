// src/components/IconBox/IconBox.tsx
'use client';

import { twMerge } from 'tailwind-merge';

// 이미지 import
import chevronDown from '@/assets/icons/chevronDown.svg';
import download from '@/assets/icons/download.svg';
import edit from '@/assets/icons/edit.svg';
import link from '@/assets/icons/link.svg';
import menu from '@/assets/icons/menu.svg';
import pieChart from '@/assets/icons/pieChart.svg';
import plus from '@/assets/icons/plus.svg';
import plusCircle from '@/assets/icons/plusCircle.svg';
import text from '@/assets/icons/text.svg';
import x from '@/assets/icons/x.svg';
import check from '@/assets/icons/check.svg';
import trash from '@/assets/icons/trash.svg';
import colDots from '@/assets/icons/colDots.svg';
import checkW from '@/assets/icons/check-w.svg';

// 아이콘 이미지 매핑 객체
const ICON_IMAGES = {
  chevronDown,
  download,
  edit,
  link,
  menu,
  pieChart,
  plus,
  plusCircle,
  text,
  x,
  check,
  trash,
  colDots,
  checkW,
} as const;

// 아이콘 이름 타입
type IconName = keyof typeof ICON_IMAGES;

interface IconBoxProps {
  /** 아이콘 이름 */
  name: IconName;
  /** 아이콘 크기 (px) */
  size?: number;
  /** 아이콘 색상 */
  // color?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 회전 각도 (도) */
  rotate?: number;
}

export default function IconBox({
  name,
  size = 24,
  className,
  onClick,
  rotate,
}: IconBoxProps) {
  const iconSrc = ICON_IMAGES[name];

  if (!iconSrc) {
    console.warn(`Icon with name "${name}" not found`);
    return null;
  }

  return (
    <div
      className={twMerge(
        'inline-flex items-center justify-center',
        onClick && 'cursor-pointer',
        onClick &&
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        className
      )}
      style={{
        width: size,
        height: size,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img src={iconSrc} alt={`${name} icon`} width={size} height={size} />
    </div>
  );
}
