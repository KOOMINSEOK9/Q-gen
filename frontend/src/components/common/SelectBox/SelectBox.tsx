// src/components/SelectBox/SelectBox.tsx
import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectBoxOption {
  value: string;
  label: string;
}

interface SelectBoxProps {
  options: SelectBoxOption[];
  defaultValue?: SelectBoxOption;
  onChange?: (option: SelectBoxOption) => void;
  className?: string;
}

export const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  defaultValue,
  onChange,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectBoxOption>(
    defaultValue || options[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option: SelectBoxOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className={twMerge("relative inline-block", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-32 px-4 py-2 bg-white rounded-full border border-gray-200 focus:outline-none"
      >
        <span>{selectedOption.label}</span>
        <span className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`
                block w-full px-4 py-2 text-left hover:bg-gray-50
                ${option.value === selectedOption.value ? 'bg-gray-100' : ''}
                first:rounded-t-lg last:rounded-b-lg
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};