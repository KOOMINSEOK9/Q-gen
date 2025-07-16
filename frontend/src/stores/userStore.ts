import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: number | null;
  setUserId: (id: number | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id) => set({ userId: id }),
    }),
    {
      name: 'user-store', // localStorage key
    }
  )
);
