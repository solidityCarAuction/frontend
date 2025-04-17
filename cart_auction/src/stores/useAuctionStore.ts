import { create } from "zustand";
import { auctionContract } from "../auctionInstance";

interface AuctionItem {
  Brand: string;
  Rnumber: string;
}

interface AuctionState {
  item: AuctionItem; // 현재 경매아이템 정보
  status: "종료됨" | "진행중" | "에러"; // 경매 상태
  highestBid: number; // 현재 최고 입찰가
  highestBidder: string; // 현재 최고 입찰가의 주소
  timeLeft: number; // 남은 시간 (초단위)
  getAuctionItem: () => Promise<void>;
  updateHighestBid: (amount: number, bidder: string) => void;
  getTimeLeft: () => Promise<void>;
  getStatus: () => Promise<void>;
  getHighestBid: () => Promise<void>;
  getHighestBidder: () => Promise<void>;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  item: { Brand: "", Rnumber: "" },
  status: "종료됨",
  highestBid: 0,
  highestBidder: "",
  timeLeft: 0,

  getHighestBid: async () => {
    try {
      const amount = await auctionContract.methods.highestBid().call();
      if (amount) {
        set((state) => ({ ...state, highestBid: amount }));
      }
    } catch (e) {
      console.error("최고가 입찰금 정보 가져오는 도중 에러발생: ", e);
      set((state) => ({ ...state, highestBid: 0 }));
    }
  },

  getHighestBidder: async () => {
    try {
      const wallet = await auctionContract.methods.highestBidder().call();
      if (wallet) {
        set((state) => ({ ...state, highestBidder: wallet }));
      }
    } catch (e) {
      console.error("최고가 지갑주소 정보 가져오는 도중 에러발생: ", e);
      set((state) => ({ ...state, highestBidder: "" }));
    }
  },

  getAuctionItem: async () => {
    try {
      const auctionItem = await auctionContract.methods.Mycar().call();

      if (auctionItem) {
        set((state) => ({
          ...state,
          item: {
            Brand: auctionItem.Brand,
            Rnumber: auctionItem.Rnumber,
          },
        }));
      }
    } catch (e) {
      console.error("경매 정보를 가져오는데 실패했습니다: ", e);
      set((state) => ({
        ...state,
        item: {
          Brand: "",
          Rnumber: "",
        },
      }));
    }
  },

  getStatus: async () => {
    try {
      const auctionState = await auctionContract.methods.STATE().call();
      console.log(auctionState);
      if (auctionState) {
        switch (auctionState) {
          case "0":
            set((state) => ({ ...state, status: "종료됨" }));
            break;
          case "1":
            set((state) => ({ ...state, status: "진행중" }));
            break;
        }
      }
    } catch (e) {
      console.error("경매 상태를 가져오는데 실패했습니다: ", e);
      set((state) => ({ ...state, status: "에러" }));
    }
  },

  getTimeLeft: async () => {
    try {
      const timeLeft = await auctionContract.methods.auction_end().call();
      console.log(timeLeft);
      if (timeLeft) {
        set((state) => ({ ...state, timeLeft: timeLeft }));
      }
    } catch (e) {
      console.error("경매 종료시간 정보를 가져오는데 실패했습니다: ", e);
      set((state) => ({ ...state, timeLeft: 0 }));
    }
  },

  updateHighestBid: (amount, bidder) => set({ highestBid: amount, highestBidder: bidder }), // useAuctionEvents 에서 세팅
}));
