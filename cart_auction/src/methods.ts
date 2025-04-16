import { createSysMsg, throwError, weiToEther } from "./utils";

import { auctionContract, bidder, web3 } from "./auction";
import { EventData } from "web3-eth-contract";

// 옥션 종료 함수
export const quitAuction = async (userWalletAddress: string) => {
  if (userWalletAddress) {
    try {
      const res = await auctionContract.methods.deactivateAuction().send({
        from: userWalletAddress,
        gas: 200000,
      });
      console.log(res);
      return res;
    } catch (e) {
      console.error(e);
    }
  }
};

// 최고가 입찰자 정보 가져오는 함수
export const getHighestBidder = async () => {
  try {
    const res = await auctionContract.methods.highestBidder().call();
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 현재 최고가 입찰가를 가져오는 함수
export const getHighestBid = async () => {
  try {
    const res = await auctionContract.methods.highestBid().call();
    return weiToEther(res);
  } catch (e) {
    console.error(e);
  }
};

// 현재 옥션의 상태를 가져오는 함수
export const getAuctionState = async () => {
  try {
    const res = await auctionContract.methods.STATE().call();

    switch (res) {
      case "1":
        return "진행중";
      case "0":
        return "종료";
    }
  } catch (e) {
    throwError(e, "옥션 상태를 가져오는 도중 실패했습니다.");
  }
};

// 현재 옥션에 올라와있는 매물을 가져오는 함수 (지금은 자동차로 고정)
export const getAuctionItemData = async () => {
  try {
    const res = await auctionContract.methods.Mycar().call();
    console.log(res);
    return res;
  } catch (e) {
    throwError(e, "옥션 아이템을 가져오는 도중 실패했습니다.");
  }
};

// 나의 입찰가 정보를 가져오는 함수
export const getBids = async () => {
  try {
    const res = await auctionContract.methods.bids(bidder).call();
    return weiToEther(res);
  } catch (e) {
    console.error(e);
  }
};

// 옥션 종료 시간 출력
export const getAuctionEndTime = async () => {
  try {
    const res = await auctionContract.methods.auction_end().call();
    return res;
  } catch (e) {
    throwError(e, "시간 정보를 가져오는데 실패했습니다.");
  }
};

// 출금하기
export const withdraw = async (userWalletAddress: string | undefined) => {
  try {
    if (userWalletAddress) {
      const res = await auctionContract.methods.withdraw().send({
        from: userWalletAddress,
        gas: 200000,
      });

      const successMsg = createSysMsg("성공적으로 출금 되었습니다.", res.transactionHash);
      console.log(res, successMsg);
      return successMsg;
    }
  } catch (e) {
    throwError(e, "출금 실패");
  }
};

export const getAuctionOwner = async () => {
  try {
    const res = auctionContract.methods.get_owner().call();
    console.log("옥션 주최자: ", res);
    return res;
  } catch (e) {
    throwError(e, "옥션 주최자의 데이터를 가져오는데 실패했습니다.");
  }
};

// 내 지갑 잔액 확인
export const getBalance = async (walletAddress: string | undefined) => {
  if (!walletAddress) return;

  try {
    const balance = await web3.eth.getBalance(walletAddress); // web3를 사용하여 잔고 가져오기
    return web3.utils.fromWei(balance, "ether"); // wei 단위를 ether로 변환
  } catch (e) {
    console.error("잔고를 가져오는 도중 오류 발생:", e);
    throw e; // 오류를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
  }
};

/* 이벤트 리스너 함수들 */

// 입찰하기
export const bid = (userWalletAddress: string | undefined, mybid: string) => {
  try {
    if (userWalletAddress) {
      const res = auctionContract.methods.bid().send({
        from: userWalletAddress,
        value: web3.utils.toWei(mybid, "ether"),
        gas: 2000000,
      });
      const successMsg = createSysMsg("성공적으로 입찰되었습니다!", res.transactionHash);

      return successMsg;
    }

    throw new Error("입찰 실패");
  } catch (e) {
    throwError(e, "");
  }
};

export const subscribeWithDrawEvent = async () => {
  auctionContract.events.WithdrawalEvent({}, (error: Error | null, event: EventData) => {
    if (error) {
      console.error(error);
    } else {
      return event.returnValues.newState;
    }
  });
};

//
export const subscribeBidEvent = async () => {
  auctionContract.events
    .BidEvent(
      /*{highestBidder:"A",highestBid:"888"},*/ function (event: EventData) {
        console.log(event);
      }
    )
    .on("data", function (event: EventData) {
      console.log(event); // same results as the optional callback above
      return event.returnValues.highestBidder;
    });
};

export const subscribeCancelEvent = async () => {
  auctionContract.events
    .CanceledEvent()
    .on("connected", function (subscriptionId: string) {
      console.log("CanceledEvent 구독 시작: ", subscriptionId);
    })
    .on("data", function (event: EventData) {
      console.log("Auction canceled:", event);
      return `경매가 취소되었습니다. 시간 : ${new Date(
        event.returnValues.time * 1000
      ).toLocaleString()}`;
    })
    .on("changed", function (event: EventData) {
      console.log("이벤트가 변경되었습니다: ", event);
      // 필요한 경우 로컬 데이터베이스 업데이트 로직 구현
    })
    .on("error", function (error: Error, receipt: Error) {
      console.error("CanceledEvent 구독 중 에러 발생: ", error);
      if (receipt) {
        console.error("트랜잭션: ", receipt);
      }
      if (error) {
        console.error(error);
      }
    });
};
