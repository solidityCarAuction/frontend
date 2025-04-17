import { create } from "zustand";

interface LogState {
  logs: string[]; // 로그 메시지를 저장할 배열
  addLog: (message: string) => void; // 로그 추가 메서드
  clearLogs: () => void; // 로그 초기화 메서드
}

export const useLogStore = create<LogState>((set) => ({
  logs: [], // 초기값으로 빈 배열 설정
  addLog: (message) => set((state) => ({ logs: [...state.logs, message] })), // 로그 추가
  clearLogs: () => set({ logs: [] }), // 로그 초기화
}));
