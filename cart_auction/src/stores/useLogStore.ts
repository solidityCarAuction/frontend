import { create } from "zustand";

interface LogItem {
  id: number; // 밀리초 단위의 timestamp
  message: string;
}

interface LogState {
  logs: LogItem[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  addLog: (message) =>
    set((state) => ({
      logs: [...state.logs, { id: Date.now() + Math.random(), message }],
    })),
  clearLogs: () => set({ logs: [] }),
}));
