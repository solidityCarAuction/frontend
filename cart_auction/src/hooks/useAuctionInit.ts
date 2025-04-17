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
      await getAuctionItem();
      await getTimeLeft();
      await getStatus();
      await getWallets();
      getBalance(currentWallet);

      setIsFetched(true);
    };

    initializeAuction();
  }, []);

  return isFetched;
};

export default useAuctionInit;
