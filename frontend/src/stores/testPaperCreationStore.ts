import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TestPaperCreationState {
  creatingTestPaperIds: number[];
  addCreatingTestPaper: (id: number) => void;
  removeCreatingTestPaper: (id: number) => void;
  reset: () => void;
}

export const useTestPaperCreationStore = create<TestPaperCreationState>()(
  persist(
    (set) => ({
      creatingTestPaperIds: [],
      addCreatingTestPaper: (id) =>
        set((state) => ({
          creatingTestPaperIds: [...state.creatingTestPaperIds, id],
        })),
      removeCreatingTestPaper: (id) =>
        set((state) => ({
          creatingTestPaperIds: state.creatingTestPaperIds.filter(
            (paperId) => paperId !== id
          ),
        })),
      reset: () => set({ creatingTestPaperIds: [] }),
    }),
    {
      name: 'test-paper-creation-store',
    }
  )
);
