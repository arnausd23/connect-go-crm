import create from 'zustand';

interface WindowState {
  window: Window | null;
  setWindow: (window: Window | null) => void;
}

export const useWindowStore = create<WindowState>()((set) => ({
  window: null,
  setWindow: (window) => set(() => ({ window })),
}));
