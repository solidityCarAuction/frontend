import { useEffect, useState } from "react";
import { useAuctionStore } from "../stores/useAuctionStore";
import { useUserStore } from "../stores/useUserStore";

const useAuctionInit = () => {
  const { getAuctionItem, getTimeLeft, getStatus } = useAuctionStore(
    (state) => state
  );
  const { getWallets, getBalance } = useUserStore((state) => state);
  const currentWallet = useUserStore((state) => state.currentWallet);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const initializeAuction = async () => {
      try {
        // 먼저 지갑 주소를 가져옵니다 (getWallets 내부에서 getOwnerWallet이 호출됨)
        await getWallets();

        // 그 다음 나머지 데이터를 가져옵니다
        await Promise.all([
          getAuctionItem(),
          getTimeLeft(),
          getStatus(),
          getBalance(currentWallet),
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
