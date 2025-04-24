import { useEffect, useRef } from "react";
import { useAuctionStore } from "./stores/useAuctionStore";
import { useUserStore } from "./stores/useUserStore";
import { auctionContract } from "./auctionInstance";
import { EventData } from "web3-eth-contract";
import { useLogStore } from "./stores/useLogStore";
import { formatTime, weiToEther, formatUnixTimestamp } from "./utils";

const useAuctionEvents = () => {
  const updateHighestBid = useAuctionStore((state) => state.updateHighestBid);
  const currentWallet = useUserStore((state) => state.currentWallet);
  const getBalance = useUserStore((state) => state.getBalance);
  const addLog = useLogStore((state) => state.addLog);
  const getStatus = useAuctionStore((state) => state.getStatus);

  // 이벤트 리스너가 이미 등록되었는지 확인하기 위한 ref
  const eventListenersRef = useRef({
    bid: false,
    cancel: false,
    state: false,
    withdraw: false,
    ownerWithdraw: false
  });

  // 1. 입찰 이벤트
  useEffect(() => {
    if (eventListenersRef.current.bid) return;

    const bidEvent = auctionContract.events.BidEvent().on("data", async (event: EventData) => {
      const { highestBidder, highestBid } = event.returnValues;
      const truncatedBidder = highestBidder.substring(0, 7);
      
      console.log("입찰 이벤트 데이터:", event.returnValues);
      addLog(`[입찰] ${truncatedBidder}: ${weiToEther(highestBid)} eth`);
      
      // 상태 업데이트를 동기적으로 처리
      await updateHighestBid(Number(highestBid), highestBidder);
      
      if (currentWallet) {
        await getBalance(currentWallet);
        await getStatus();
      }
    });

    eventListenersRef.current.bid = true;

    return () => {
      bidEvent.off();
      eventListenersRef.current.bid = false;
    };
  }, [currentWallet, updateHighestBid, getBalance, getStatus, addLog]);

  // 2. 경매 취소 이벤트
  useEffect(() => {
    if (eventListenersRef.current.cancel) return;

    const cancelEvent = auctionContract.events
      .CanceledEvent()
      .on("data", async (event: EventData) => {
        const { time } = event.returnValues;
        
        console.log("경매 취소 이벤트 데이터:", event.returnValues);
        addLog(`[경매 취소] ${formatUnixTimestamp(Number(time))}`);

        if (currentWallet) {
          await Promise.all([
            getBalance(currentWallet),
            getStatus()
          ]);
        }
      });

    eventListenersRef.current.cancel = true;

    return () => {
      cancelEvent.off();
      eventListenersRef.current.cancel = false;
    };
  }, [currentWallet, getBalance, getStatus, addLog]);

  // 3. 경매 상태 이벤트
  useEffect(() => {
    if (eventListenersRef.current.state) return;

    const auctionStateEvent = auctionContract.events
      .StateUpdated()
      .on("data", async (event: EventData) => {
        const { message, time } = event.returnValues;

        console.log("경매 상태 이벤트 데이터:", event.returnValues);
        addLog(`[시스템] ${message} 시간 : ${formatTime(time)}`);

        await getStatus();
        if (currentWallet) {
          await getBalance(currentWallet);
        }
      });

    eventListenersRef.current.state = true;

    return () => {
      auctionStateEvent.off();
      eventListenersRef.current.state = false;
    };
  }, [currentWallet, getStatus, getBalance, addLog]);

  // 4. 출금 이벤트
  useEffect(() => {
    if (eventListenersRef.current.withdraw) return;

    const withdrawEvent = auctionContract.events
      .WithdrawalEvent()
      .on("data", async (event: EventData) => {
        const { withdrawer, amount } = event.returnValues;
        const truncatedWithdrawer = withdrawer.substring(0, 7);

        console.log("출금 이벤트 데이터:", event.returnValues);
        addLog(`[출금] ${truncatedWithdrawer} : ${weiToEther(amount)} eth`);

        if (currentWallet) {
          await Promise.all([
            getBalance(currentWallet),
            getStatus()
          ]);
        }
      });

    eventListenersRef.current.withdraw = true;

    return () => {
      withdrawEvent.off();
      eventListenersRef.current.withdraw = false;
    };
  }, [currentWallet, getBalance, getStatus, addLog]);
  
  useEffect(() => {
    if (eventListenersRef.current.ownerWithdraw) return;

    const ownerWithdrawEvent = auctionContract.events
      .OwnerWithdrawalEvent()
      .on("data", async (event: EventData) => {
        const { amount } = event.returnValues;

        console.log("소유자 출금 이벤트 데이터:", event.returnValues);
        addLog(`[최종 입찰가 회수] ${weiToEther(amount)} eth`);

        if (currentWallet) {
          await getBalance(currentWallet);
        }
      });

    eventListenersRef.current.ownerWithdraw = true;

    return () => {
      ownerWithdrawEvent.off();
      eventListenersRef.current.ownerWithdraw = false;
    };
  }, [currentWallet, getBalance, getStatus, addLog]);
};

export default useAuctionEvents;
