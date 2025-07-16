import { create } from 'zustand';
import { GenerateResponse } from '@/types/generate';

interface GenerateState {
  generated: GenerateResponse['data'] | null;
  setGenerated: (paper: GenerateResponse['data']) => void;
  clearGenerated: () => void;
}

export const useGenerateStore = create<GenerateState>((set) => ({
  generated: null,
  setGenerated: (paper) => set({ generated: paper }),
  clearGenerated: () => set({ generated: null }),
}));
