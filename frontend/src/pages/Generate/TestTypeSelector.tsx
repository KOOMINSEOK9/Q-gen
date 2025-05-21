import { TestType } from '@/types/generate';
import { useState } from 'react';

interface ProblemTypeSelectorProps {
  testTypes: TestType[];
  totalProblems: number;
  onTypeClick: (typeName: string) => void;
  onCountChange: (typeName: string, newCount: number) => void;
  className?: string;
}

function ProblemTypeSelector({
  testTypes,
  totalProblems,
  onTypeClick,
  onCountChange,
  className,
}: ProblemTypeSelectorProps) {
  return (
    <div className={`bg-white rounded-3xl shadow-sm p-6 w-full ${className}`}>
      <div className='flex justify-between items-center mb-1'>
        <h2 className='text-xl font-semibold'>문제 유형 선택</h2>
        <span className='text-lg font-medium text-[#754AFF]'>
          총 {totalProblems}문제
        </span>
      </div>
      <p className='text-sm text-gray-500 mb-4 text-left'>
        최대 30문제까지 생성 가능합니다.
      </p>
      <div className='flex flex-col gap-4 w-full'>
        {testTypes.map((type) => {
          const [inputValue, setInputValue] = useState(type.count.toString());
          // Always keep inputValue in sync with type.count, except when editing
          if (
            document.activeElement === null ||
            document.activeElement.getAttribute('data-type-name') !== type.name
          ) {
            if (inputValue !== type.count.toString())
              setInputValue(type.count.toString());
          }
          return (
            <div key={type.name} className='flex items-center w-full'>
              {/* Type Button Container */}
              <div className='relative'>
                {/* Bottom shape */}
                <div
                  className={`
                        absolute w-[110px] h-[55px] 
                        rounded-3xl
                        ${
                          type.count > 0
                            ? 'bg-gradient-to-br from-[#6C2EFF] via-[#7C3AED] to-[#A78BFA] shadow-[0_0_20px_rgba(108,46,255,0.5)]'
                            : 'bg-[#B3ADFF]'
                        }
                        backdrop-blur-[50%]
                        shadow-[0_1.2px_30px_rgba(69,42,124,0.1)]
                        transition-all duration-300 ease-in-out
                        `}
                />

                {/* Type Button */}
                <button
                  onClick={() => onTypeClick(type.name)}
                  className={`
                        relative w-[110px] h-[55px] 
                        rounded-3xl
                        translate-[-2px]
                        cursor-pointer
                        ${
                          type.count > 0
                            ? 'bg-gradient-to-br from-white/40 via-white/20 to-white/10'
                            : 'bg-gradient-to-b from-white/10 via-white/5 to-transparent'
                        }
                        text-white font-pretendard font-bold text-lg leading-8 text-center
                        transition-all duration-300 ease-in-out
                        hover:scale-[1.02] active:scale-[0.98]
                        overflow-hidden
                        ${type.count > 0 ? 'shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]' : ''}
                        `}
                >
                  {/* Glass effect layer */}
                  <div
                    className={`
                          absolute inset-0
                          rounded-3xl
                          ${
                            type.count > 0
                              ? 'bg-gradient-to-br from-white/60 via-white/30 to-transparent'
                              : 'bg-gradient-to-b from-white/60 to-transparent'
                          }
                          blur-[2.5px]
                          border-[1px] 
                          ${
                            type.count > 0
                              ? 'border-white/90 shadow-[0_0_24px_rgba(108,46,255,0.4)]'
                              : 'border-white/60'
                          }
                          transition-all duration-300 ease-in-out
                          `}
                  />
                  <span
                    className={`
                          relative z-10 
                          transition-all duration-300
                          ${type.count > 0 ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}
                          `}
                  >
                    {type.name}
                  </span>
                </button>
              </div>

              {/* Count Controls - Always visible */}
              <div className='flex-1 flex items-center justify-center ml-4'>
                <div
                  className={`
                      flex items-center justify-between w-full
                      transition-all duration-300
                      border rounded-xl px-2 py-2.5
                      ${type.count > 0 ? 'border-[#754AFF]/50' : 'border-gray-200'}
                    `}
                >
                  <button
                    onClick={() => onCountChange(type.name, type.count - 1)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer
                      ${type.count === 0 ? 'bg-gray-200 text-gray-400 cursor-default' : 'bg-[#764EFF]/30 text-white hover:bg-[#764EFF]/70'}`}
                    disabled={type.count === 0}
                  >
                    -
                  </button>
                  <input
                    type='number'
                    min={0}
                    max={30}
                    value={inputValue}
                    data-type-name={type.name}
                    onChange={(e) => {
                      // Allow empty string while editing
                      if (e.target.value === '') {
                        setInputValue('');
                        return;
                      }
                      let value = parseInt(e.target.value, 10);
                      if (isNaN(value)) value = 0;
                      // Check if total would exceed 30
                      const currentTotal = testTypes.reduce(
                        (sum, t) => sum + (t.name === type.name ? 0 : t.count),
                        0
                      );
                      if (value + currentTotal > 30) return;
                      setInputValue(e.target.value);
                      onCountChange(type.name, value);
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setInputValue('0');
                        onCountChange(type.name, 0);
                      }
                    }}
                    className={`w-12 text-center font-semibold bg-transparent outline-none border-none appearance-none focus:ring-0 focus:outline-none transition-colors hide-spin
                      ${type.count === 0 ? 'text-gray-400' : 'text-black'}`}
                    disabled={
                      totalProblems - type.count + (type.count || 0) > 30
                    }
                  />
                  <button
                    onClick={() => onCountChange(type.name, type.count + 1)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer
                      ${type.count === 0 ? 'bg-gray-200 text-gray-400 cursor-default' : 'bg-[#764EFF]/30 text-white hover:bg-[#764EFF]/70'}`}
                    disabled={totalProblems >= 30}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProblemTypeSelector;
