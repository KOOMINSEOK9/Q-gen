// src/components/TestPaperList/TestPaperList.tsx

import Button from '@/components/common/Button/Button';
import IconBox from '@/components/common/IconBox/IconBox';
import { MouseEvent } from 'react';

interface TestPaper {
  workbookId: string | number;
  testPaperId: string | number;
  title: string;
  createAt: string;
  quantity: number;
  types: string;
  oxAns: number;
  choiceAns: number;
  shortAns: number;
  onPdfClick?: () => void;
  onSolveClick?: () => void;
  onHistoryClick?: () => void;
  onDelete?: (testPaperId: number) => void;
  isCreating?: boolean;
}

interface TestPaperListProps {
  papers: TestPaper[];
  onAddClick?: () => void;
  onPdfClick?: (testPaperId: string | number) => void;
  onSolveClick?: (testPaperId: string | number) => void;
  onHistoryClick?: (testPaperId: string | number) => void;
  onNoteClick?: (testPaperId: string | number) => void;
  onDelete?: (testPaperId: string | number) => void;
}

function TestPaperList({
  papers,
  onAddClick,
  onPdfClick,
  onSolveClick,
  onHistoryClick,
  onDelete,
}: TestPaperListProps) {
  // 문제 유형 텍스트 생성 함수
  const getTypeLabels = (paper: TestPaper) => {
    const types: string[] = [];
    if (paper.choiceAns > 0) types.push('객관식');
    if (paper.oxAns > 0) types.push('OX선택');
    if (paper.shortAns > 0) types.push('주관식');
    return types.join(', ');
  };

  // 날짜만 추출하는 함수 (YYYY-MM-DD)
  const getDateOnly = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.slice(0, 10);
  };

  return (
    <div className='bg-[rgba(255,255,255,0.75)] h-full rounded-2xl p-4 flex flex-col gap-2 shadow border border-gray-100 min-h-[40vh] overflow-y-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {papers.map((paper) => (
          <div
            onClick={() => onHistoryClick?.(paper.testPaperId)}
            key={paper.testPaperId}
            className={`relative bg-white rounded-2xl p-4 flex flex-col gap-2 shadow border border-gray-100 ${paper.isCreating ? 'pointer-events-none' : ''}`}
          >
            {/* 블러 처리 */}
            <div className={paper.isCreating ? 'blur-sm' : ''}>
              <div className='flex items-center justify-between'>
                <div className='font-semibold truncate max-w-[200px]'>
                  {paper.title}
                </div>
                <div className='flex gap-2'>
                  <Button
                    onClick={() => paper.onPdfClick?.()}
                    variant='outlined'
                    className='px-2 py-1 text-xs'
                    disabled={paper.isCreating}
                  >
                    PDF 변환
                  </Button>
                  <Button
                    onClick={() => paper.onSolveClick?.()}
                    variant='filled'
                    className='px-3 py-1 text-xs'
                    disabled={paper.isCreating}
                  >
                    문제 풀기
                  </Button>
                  <Button
                    onClick={() => paper.onHistoryClick?.()}
                    variant='filled'
                    className='px-3 py-1 text-xs'
                    disabled={paper.isCreating}
                  >
                    이력 확인
                  </Button>
                </div>
              </div>
              <div className='text-xs text-gray-500 flex justify-between align-end'>
                <div>
                  생성일 {getDateOnly(paper.createAt)} · 문제수 {paper.quantity}
                  <br />
                  문제유형: {getTypeLabels(paper)}
                </div>
                <div className='flex pt-5'>
                  <IconBox
                    name='trash'
                    size={12}
                    className='cursor-pointer hover:text-red-500'
                    onClick={() => {
                      if (window.confirm('이 시험지를 삭제하시겠습니까?')) {
                        paper.onDelete?.(Number(paper.testPaperId));
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {/* 로딩 오버레이 */}
            {paper.isCreating && (
              <div className='absolute inset-0 flex items-center justify-center z-10'>
                <div className='bg-white/60 w-full h-full absolute top-0 left-0 rounded-2xl' />
                <span className='z-10 text-purple-600 font-bold'>
                  생성 중...
                </span>
              </div>
            )}
          </div>
        ))}

        {/* 새 시험지 추가 박스 */}
        <div
          onClick={onAddClick}
          className='flex-1 border-1 border border-gray-200 rounded-2xl 
                     flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors'
        >
          <div className='flex flex-col items-center justify-center gap-2 min-h-[100px]'>
            <div className='rounded-full flex items-center justify-center'>
              <span className='text-2xl text-gray-400'>+</span>
            </div>
            <span className='text-gray-500'>새 시험지 만들기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestPaperList;
