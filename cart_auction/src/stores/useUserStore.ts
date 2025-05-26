import { create } from "zustand";
import { auctionContract, web3 } from "../config/auctionInstance";
import { weiToEther } from "../utils/utils";

interface UserState {
  walletAddresses: string[];
  currentWallet: string;
  ownerWallet: string;
  bid: number;
  balance: number;
  isAdmin: boolean;
  getWallets: () => Promise<void>;
  placeBid: (bid: number, currentWallet: string) => Promise<void>;
  withdraw: (currentWallet: string) => Promise<void>;
  switchWallet: (currentWallet: string) => void;
  getBalance: (currentWallet: string) => Promise<void>;
  checkIsAdmin: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  walletAddresses: [],
  currentWallet: "",
  ownerWallet: "",
  bid: 0,
  balance: 0,
  isAdmin: false,

  getWallets: async () => {
    try {
      const wallets = await web3.eth.getAccounts();
      if (wallets.length > 0) {
        const currentWallet = wallets[0] || "";
        web3.eth.defaultAccount = currentWallet;
        set({ currentWallet, walletAddresses: wallets });

        // 컨트랙트의 get_owner() 함수로 소유자 확인
        const owner = await auctionContract.methods.get_owner().call();
        if (owner) {
          set((state) => ({ ...state, ownerWallet: owner }));
          const isAdmin = currentWallet.toLowerCase() === owner.toLowerCase();
          set((state) => ({ ...state, isAdmin }));
        }
      }
    } catch (e) {
      console.error("지갑 주소를 가져오는데 실패했습니다:", e);
    }
  },

  getOwnerWallet: async () => {
    try {
      const { currentWallet } = useUserStore.getState();
      if (!currentWallet) {
        console.log("현재 지갑 주소가 없습니다.");
        return;
      }

      const owner = await auctionContract.methods.get_owner().call();
      console.log("컨트랙트 소유자 주소:", owner);
      console.log("현재 지갑 주소:", currentWallet);

      if (owner) {
        set((state) => ({ ...state, ownerWallet: owner }));
        const isAdmin = currentWallet.toLowerCase() === owner.toLowerCase();
        console.log("관리자 여부:", isAdmin);
        set((state) => ({ ...state, isAdmin }));
      }
    } catch (e) {
      console.error("소유자 주소를 가져오는데 실패했습니다:", e);
      set((state) => ({
        ...state,
        ownerWallet: "",
        isAdmin: false,
      }));
    }
  },

  placeBid: async (bid, currentWallet) => {
    try {
      const transaction = await auctionContract.methods.bid().send({
        from: currentWallet,
        value: web3.utils.toWei(String(bid), "ether"),
        gas: 2000000,
      });

      return transaction;
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      throw new Error(errorMsg);
    }
  },

  switchWallet: async (wallet) => {
    set({ currentWallet: wallet });
    // 지갑 변경 시 컨트랙트의 get_owner() 함수로 관리자 상태 확인
    const owner = await auctionContract.methods.get_owner().call();
    if (owner) {
      const isAdmin = wallet.toLowerCase() === owner.toLowerCase();
      set((state) => ({ ...state, isAdmin }));
    }
  },

  getBalance: async (currentWallet) => {
    try {
      if (currentWallet) {
        const newBalance = await web3.eth.getBalance(currentWallet);
        console.log(newBalance);
        if (newBalance) {
          const formattedBalance = Number(weiToEther(newBalance));
          set((state) => ({ ...state, balance: formattedBalance }));
        }
      }
    } catch (e) {
      console.error("잔액 조회 실패: ", e);
      set((state) => ({ ...state, balance: 0 }));
      throw e;
    }
  },

  withdraw: async (currentWallet) => {
    try {
      const transaction = await auctionContract.methods.withdraw().send({
        from: currentWallet,
        gas: 2000000,
      });

      if (transaction) {
        const getBalance = useUserStore.getState().getBalance;
        getBalance(currentWallet);
      }

      console.log(transaction);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      throw new Error(errorMsg);
    }
  },

  checkIsAdmin: async () => {
    try {
      const { currentWallet, ownerWallet } = useUserStore.getState();
      console.log("관리자 확인 - 현재 지갑:", currentWallet);
      console.log("관리자 확인 - 소유자 지갑:", ownerWallet);
      const isAdmin = currentWallet.toLowerCase() === ownerWallet.toLowerCase();
      console.log("관리자 확인 결과:", isAdmin);
      set((state) => ({ ...state, isAdmin }));
    } catch (e) {
      console.error("관리자 상태 확인 중 오류 발생:", e);
      set((state) => ({ ...state, isAdmin: false }));
    }
  },
}));
