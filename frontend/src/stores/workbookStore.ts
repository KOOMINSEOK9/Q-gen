import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkBook } from '@/types/workbook';

interface WorkbookInfo {
  workBookId: number;
  title: string;
  lastNumber: number; // 마지막 숫자 저장
  createAt: string;
}

interface WorkbookState {
  workbooks: WorkbookInfo[];
  currentWorkbookTitle: string | null;

  setWorkbooks: (workbooks: WorkBook[]) => void;
  setCurrentWorkbookTitle: (workbookId: number, title: string) => void;
  getCurrentWorkbookTitle: (workbookId: number) => string | null;
  updateLastNumber: (workbookId: number, number: number) => void;
  getLastNumber: (workbookId: number) => number;
}

export const useWorkbookStore = create<WorkbookState>()(
  persist(
    (set, get) => ({
      workbooks: [],
      currentWorkbookTitle: null,

      setWorkbooks: (workbooks) =>
        set((state) => {
          // 기존 워크북 정보 유지하면서 새 워크북 목록 업데이트
          const updatedWorkbooks = workbooks.map((wb) => {
            const existing = state.workbooks.find(
              (item) => item.workBookId === wb.workBookId
            );
            return {
              ...wb,
              lastNumber: existing?.lastNumber || 0, // 기존 lastNumber 유지, 없으면 0
            };
          });

          return { workbooks: updatedWorkbooks };
        }),

      setCurrentWorkbookTitle: (workbookId, title) => {
        set((state) => {
          // 업데이트된 workbooks 배열을 생성
          const updatedWorkbooks = state.workbooks.map((wb) =>
            wb.workBookId === workbookId ? { ...wb, title } : wb
          );

          // 현재 workbooks에 해당 ID가 없으면 추가
          if (!state.workbooks.some((wb) => wb.workBookId === workbookId)) {
            updatedWorkbooks.push({
              workBookId: workbookId,
              title,
              lastNumber: 0, // 처음 추가시 기본값 0
              createAt: new Date().toISOString(),
            });
          }

          return {
            workbooks: updatedWorkbooks,
            currentWorkbookTitle: title,
          };
        });
      },

      getCurrentWorkbookTitle: (workbookId) => {
        const state = get();
        const workbook = state.workbooks.find(
          (wb) => wb.workBookId === workbookId
        );
        return workbook ? workbook.title : null;
      },

      updateLastNumber: (workbookId, number) => {
        set((state) => {
          const updatedWorkbooks = state.workbooks.map((wb) =>
            wb.workBookId === workbookId ? { ...wb, lastNumber: number } : wb
          );

          // ID가 없는 경우 추가 (정상적인 흐름에서는 발생하지 않아야 함)
          if (!state.workbooks.some((wb) => wb.workBookId === workbookId)) {
            console.warn(
              `워크북 ID ${workbookId}가 없습니다. lastNumber 업데이트 불가`
            );
          }

          return { workbooks: updatedWorkbooks };
        });
      },

      getLastNumber: (workbookId) => {
        const state = get();
        const workbook = state.workbooks.find(
          (wb) => wb.workBookId === workbookId
        );
        return workbook?.lastNumber || 0;
      },
    }),
    {
      name: 'workbook-store',
    }
  )
);
