import { TestListProps } from '@/types/note';
import Button from '@/components/common/Button/Button';

function TestList({
  currentNumber,
  totalTests,
  onTestClick,
  testDetails,
}: TestListProps) {
  const getButtonColor = (idx: number) => {
    if (!testDetails || !testDetails[idx]) return '';
    const historyList = testDetails[idx].testHistoryList;
    if (!historyList || historyList.length === 0) return '';
    const latest = historyList[historyList.length - 1];
    if (latest.correct)
      return 'bg-[#009d77]/10 border-[#009d77]/20 hover:bg-[#009d77]/50 hover:border-transparent';
    else
      return 'bg-[#ff4339]/10 border-[#ff4339]/20 hover:bg-[#ff4339]/50 hover:border-transparent';
  };
  return (
    <div className='flex flex-col'>
      <h3 className='text-lg font-bold mb-4'>문제 목록</h3>
      <div className='grid grid-cols-5 gap-2'>
        {Array.from({ length: Math.min(totalTests) }, (_, i) => i + 1).map(
          (number, idx) => {
            const isSelected = number === currentNumber;
            const colorClass = !isSelected ? getButtonColor(number - 1) : '';
            return (
              <Button
                key={number}
                onClick={() => onTestClick(number)}
                variant={isSelected ? 'filled' : 'basic'}
                className={
                  (isSelected
                    ? 'px-4 py-2 text-sm shadow-sm'
                    : 'px-4 py-2 text-sm bg-white text-gray-700 border border-gray-200 hover:bg-[#754AFF]/10 hover:border-[#754AFF]/80') +
                  ' ' +
                  colorClass
                }
              >
                {number}
              </Button>
            );
          }
        )}
      </div>
    </div>
  );
}

export default TestList;
