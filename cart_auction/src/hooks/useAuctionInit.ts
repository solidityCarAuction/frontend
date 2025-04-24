import { useEffect, useState } from "react";
import { useAuctionStore } from "../stores/useAuctionStore";
import { useUserStore } from "../stores/useUserStore";

const useAuctionInit = () => {
  const { getAuctionItem, getTimeLeft, getStatus } = useAuctionStore((state) => state);
  const { getWallets, getBalance } = useUserStore((state) => state);
  const currentWallet = useUserStore((state) => state.currentWallet);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const initializeAuction = async () => {
      try {
        await Promise.all([
          getAuctionItem(),
          getTimeLeft(),
          getStatus(),
          getWallets(),
          getBalance(currentWallet)
        ]);
        setIsFetched(true);
      } catch (error) {
        console.error("초기화 중 오류 발생:", error);
      }
    };

    initializeAuction();
  }, []);

  return isFetched;
};

export default useAuctionInit;
