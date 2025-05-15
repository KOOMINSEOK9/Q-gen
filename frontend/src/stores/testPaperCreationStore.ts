import { create } from 'zustand';

interface TestPaperCreationState {
  creatingTestPaperIds: number[];
  addCreatingTestPaper: (id: number) => void;
  removeCreatingTestPaper: (id: number) => void;
  reset: () => void;
}

export const useTestPaperCreationStore = create<TestPaperCreationState>(
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
  })
);
