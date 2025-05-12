import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'basic' | 'small';
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  children,
  onClick,
  disabled,
  className,
}) => {
  const baseStyles =
    'flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    filled:
      'bg-gradient-to-r from-[#754AFF] to-[#A34BFF] text-white px-6 py-3 hover:from-[#6642E6] hover:to-[#9343E6]',
    outlined:
      'border border-[#754AFF] text-[#754AFF] px-6 py-3 hover:bg-[#754AFF] hover:text-white hover:border-transparent',
    basic: 'bg-[#754AFF] text-white px-6 py-3 hover:bg-[#6642E6]',
    small: 'bg-[#754AFF] text-white px-4 py-2 text-sm hover:bg-[#6642E6]',
  };

  const getButtonClasses = () => {
    let classes = `${baseStyles} ${variantStyles[variant]}`;

    if (variant === 'small') {
      if (className?.includes('primary')) {
        classes += ' bg-[#754AFF] text-white hover:bg-[#6642E6]';
      } else if (className?.includes('secondary')) {
        classes +=
          ' bg-white text-gray-700 border border-gray-300 hover:bg-[#754AFF]/10 hover:border-[#754AFF]/80';
      }
    }

    return twMerge(classes, className);
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
