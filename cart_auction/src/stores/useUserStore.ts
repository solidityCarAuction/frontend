import { create } from "zustand";
import { auctionContract, web3 } from "../utils/auctionInstance";
import { weiToEther } from "../utils/utils";

interface UserState {
  walletAddresses: string[];
  currentWallet: string;
  ownerWallet: string;
  bid: number;
  balance: number;
  getWallets: () => Promise<void>;
  placeBid: (bid: number, currentWallet: string) => Promise<void>;
  withdraw: (currentWallet: string) => Promise<void>;
  switchWallet: (currentWallet: string) => void;
  getBalance: (currentWallet: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  walletAddresses: [],
  currentWallet: "",
  ownerWallet: "",
  bid: 0,
  balance: 0,

  getWallets: async () => {
    try {
      const wallets = await web3.eth.getAccounts();
      if (wallets.length > 0) {
        web3.eth.defaultAccount = wallets[0];
        set({ currentWallet: wallets[0] || "" });
        set({ walletAddresses: wallets });
      }
    } catch (e) {
      console.error(e);
    }
  },

  getOwnerWallet: async () => {
    try {
      const owner = await auctionContract.methods.get_owner();
      if (owner) {
        set((state) => ({ ...state, ownerWallet: owner || "" }));
      }
    } catch (e) {
      console.error(e);
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

  switchWallet: (wallet) => set({ currentWallet: wallet }),

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
        const getBalance = useUserStore.getState().getBalance; // getBalance 가져오기
        getBalance(currentWallet); // 잔액 갱신
      }

      console.log(transaction);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      throw new Error(errorMsg);
    }
  },
}));
