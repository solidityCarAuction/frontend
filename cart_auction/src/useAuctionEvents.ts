import { useEffect } from "react";
import { useAuctionStore } from "./stores/useAuctionStore";
import { useUserStore } from "./stores/useUserStore";
import { auctionContract } from "./auctionInstance";
import { EventData } from "web3-eth-contract";
import { useLogStore } from "./stores/useLogStore";
import { formatTime, weiToEther } from "./utils";

const useAuctionEvents = () => {
  const updateHighestBid = useAuctionStore((state) => state.updateHighestBid);
  const currentWallet = useUserStore((state) => state.currentWallet);
  const getBalance = useUserStore((state) => state.getBalance);
  const addLog = useLogStore((state) => state.addLog);
  const getStatus = useAuctionStore((state) => state.getStatus);
  // const getTimeLeft = useAuctionStore((state) => state.updateTimeLeft);
  // const higestBid = useAuctionStore((state) => state.highestBid);
  // const higestBidder = useAuctionStore((state) => state.highestBidder);

  useEffect(() => {
    // 1. 입찰 이벤트
    const bidEvent = auctionContract.events.BidEvent().on("data", async (event: EventData) => {
      const { highestBidder, highestBid } = event.returnValues;

      const truncatedBidder = highestBidder.substring(0, 7);
      console.log("입찰 이벤트 데이터:", event.returnValues); // 디버깅용 로그
      addLog(`[입찰] ${truncatedBidder}: ${weiToEther(highestBid)} eth `);
      updateHighestBid(Number(highestBid), highestBidder); // 최고가 입찰금 갱신

      if (currentWallet) {
        await getBalance(currentWallet);
      }
    });

    // 2. 경매 취소 이벤트
    const cancelEvent = auctionContract.events
      .CanceledEvent()
      .on("data", async (event: EventData) => {
        const { time } = event.returnValues;
        getBalance(currentWallet); // 현재 지갑의 잔액 갱신

        console.log("경매 취소 이벤트 데이터:", event.returnValues); // 디버깅용 로그
        addLog(`[경매 취소] ${formatTime(time)}`);

        if (currentWallet) {
          await getStatus();
        }
      });

    // 3. 경매 상태 이벤트
    const auctionStateEvent = auctionContract.events
      .StateUpdated()
      .on("data", async (event: EventData) => {
        const { message, time } = event.returnValues;

        console.log("경매 상태 이벤트 데이터:", event.returnValues); // 디버깅용 로그
        addLog(`[시스템] ${message} 시간 : ${formatTime(time)}`);

        await getStatus(); // 서버의 상태를 받아와서 최신화
      });

    // 4. 출금 이벤트
    const withdrawEvent = auctionContract.events
      .WithdrawalEvent()
      .on("data", async (event: EventData) => {
        const { withdrawer, amount } = event.returnValues;

        // withdrawer 문자열을 길이 7로 잘라줍니다.
        const truncatedWithdrawer = withdrawer.substring(0, 7);

        console.log("출금 이벤트 데이터:", event.returnValues); // 디버깅용 로그
        addLog(`[출금] ${truncatedWithdrawer} : ${weiToEther(amount)} eth`);

        if (currentWallet) {
          await getBalance(currentWallet);
        }
      });

    // 이벤트 리스너 제거
    return () => {
      bidEvent.off();
      cancelEvent.off();
      auctionStateEvent.off();
      withdrawEvent.off();
    };
  }, []);
};

export default useAuctionEvents;
