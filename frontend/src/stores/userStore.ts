import { create } from 'zustand';

interface UserState {
  userId: number | null;
  setUserId: (id: number | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));
