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
    'flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    filled:
      'bg-gradient-to-r from-[#754AFF] to-[#A34BFF] text-white px-6 py-3 hover:from-[#6642E6] hover:to-[#9343E6]',
    outlined:
      'border border-[#754AFF] text-[#754AFF] px-6 py-3 hover:bg-[#754AFF] hover:text-white hover:border-transparent',
    basic: 'bg-[#754AFF] text-white px-6 py-3 hover:bg-[#6642E6]',
    small: 'bg-[#754AFF] text-white px-4 py-2 text-sm hover:bg-[#6642E6]',
  };

  return (
    <button
      className={twMerge(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
