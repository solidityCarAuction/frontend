import { create } from "zustand";

interface LogItem {
  id: number; // 밀리초 단위의 timestamp
  message: string;
  timestamp: number;
}

interface LogState {
  logs: LogItem[];
  addLog: (message: string) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  addLog: (message) =>
    set((state) => {
      // 마지막 로그와 같은 메시지인지 확인
      const lastLog = state.logs[state.logs.length - 1];
      const currentTime = Date.now();
      
      // 같은 메시지이고 1초 이내에 발생한 경우 중복 로그로 간주
      if (lastLog && lastLog.message === message && currentTime - lastLog.timestamp < 1000) {
        return state;
      }

      return {
        logs: [...state.logs, { 
          id: currentTime + Math.random(), 
          message,
          timestamp: currentTime
        }],
      };
    }),
  clearLogs: () => set({ logs: [] }),
}));
