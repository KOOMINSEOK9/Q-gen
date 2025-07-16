// src/stores/modalStore.ts
import { create } from 'zustand';

interface ModalState {
  showTextModal: boolean;
  setShowTextModal: (show: boolean) => void;
  showBasicGuideModal: boolean;
  setShowBasicGuideModal: (show: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showTextModal: false,
  setShowTextModal: (show) => set({ showTextModal: show }),
  showBasicGuideModal: false,
  setShowBasicGuideModal: (show) => set({ showBasicGuideModal: show }),
}));
