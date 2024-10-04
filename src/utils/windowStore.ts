import { create } from 'zustand';

interface WindowState {
  window: Window | null;
  setWindow: (window: Window | null) => void;
}

export const useWindowStore = create<WindowState>()((set:any) => ({
  window: null,
  setWindow: (window:any) => set(() => ({ window })),
}));
