# 블록체인 경매사이트 프로젝트

이 프로젝트는 블록체인 경매 시스템을 구현한 웹 애플리케이션입니다.
사용자는 경매에 참여(입찰)하고, 출금할 수 있으며, 경매 주최자는 경매 상태를 확인할 수 있습니다.

## 프로젝트 참여자

| 이름   | 역할  | GitHub                                       |
| ------ | ----- | -------------------------------------------- |
| 김진모 | FE/BE | [GitHub](https://github.com/moriroKim)       |
| 방현민 | BE    | [GitHub](https://github.com/banghyunmin1999) |

각 팀원은 프로젝트의 백엔드 개발에 기여하였으며, GitHub 링크를 통해 각자의 작업을 확인할 수 있습니다.

## 주요 기능

- **경매 이벤트 처리**: 경매와 관련된 다양한 이벤트를 실시간으로 처리합니다.
- **상태 관리**: `zustand`를 사용하여 상태를 관리하며, 각 컴포넌트의 상태가 최신화되도록 보장합니다.
- **Web3.js 사용**: 솔리디티 메서드를 호출하고, 소켓 통신을 통해 이벤트를 구독합니다.

## 사용 스택

- **프론트엔드**: React, TypeScript, Web3.js
- **백엔드**: Solidity(Remix), Ganache
- **상태 관리**: Zustand
- **스타일링**: CSS, Tailwind CSS
- **기타**: lodash

## 트러블슈팅 경험

### 1. 비동기 함수

비동기 함수의 동기화 문제를 해결하기 위해 `lodash`의 `debounce`를 사용했습니다. 이는 버튼을 빠르게 클릭했을 때 비동기 함수와의 싱크를 조절하는 데 유용했습니다.

```typescript
import { debounce } from "lodash";

const handlePlaceBid = debounce(async () => {
  if (amount > balance) {
    addLog(`[에러]: 지갑의 잔금이 부족합니다!`);
  } else {
    try {
      await placeBid(amount, currentWallet);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      const delimeter = errorMsg.split("revert")[1];
      addLog(`[에러]: ${delimeter}`);
    }
  }
}, 200); // 비동기 함수와 싱크를 맞추기 위해 0.2초 디바운스 추가
```

### 2. 상태 관리

상태가 각 컴포넌트별로 최신화되지 않는 문제를 `zustand`로 해결했습니다. `zustand`를 사용하여 상태를 중앙에서 관리하고, 각 컴포넌트가 동일한 상태를 참조하도록 했습니다.

```typescript

  // useUserStore
  walletAddresses: string[]; // 사용자의 지갑 주소 목록
  currentWallet: string;     // 현재 선택된 지갑 주소
  ownerWallet: string;       // 경매 소유자의 지갑 주소
  bid: number;               // 현재 입찰 금액
  balance: number;           // 현재 지갑의 잔액

  // 메서드
  getWallets: () => Promise<void>; // 사용자의 지갑 주소를 가져오는 메서드
  placeBid: (bid: number, currentWallet: string) => Promise<void>; // 입찰을 수행하는 메서드
  withdraw: (currentWallet: string) => Promise<void>; // 출금을 수행하는 메서드
  switchWallet: (currentWallet: string) => void; // 지갑을 전환하는 메서드
  getBalance: (currentWallet: string) => Promise<void>; // 지갑의 잔액을 가져오는 메서드


  // useAuctionStore
  item: AuctionItem; // 현재 경매아이템 정보
  status: "종료됨" | "진행중" | "에러"; // 경매 상태
  highestBid: number; // 현재 최고 입찰가
  highestBidder: string; // 현재 최고 입찰가의 주소
  timeLeft: number; // 남은 시간 (초단위)
  getAuctionItem: () => Promise<void>; // 경매 아이템 정보를 가져오는 메서드
  updateHighestBid: (amount: number, bidder: string) => void; // 최고 입찰가를 업데이트하는 메서드
  getTimeLeft: () => Promise<void>; // 남은 시간을 가져오는 메서드
  getStatus: () => Promise<void>; // 경매 상태를 가져오는 메서드
  getHighestBid: () => Promise<void>; // 최고 입찰가를 가져오는 메서드
  getHighestBidder: () => Promise<void>; // 최고 입찰자의 주소를 가져오는 메서드
  deactivate: (ownerWallet: string) => Promise<void>; // 경매를 비활성화하는 메서드
  withdrawFunds: (ownerWallet: string) => Promise<void>; // 남은 자금을 출금하는 메서드

  // useLogStore
  logs: LogItem[]; // 로그 항목 목록

  // 메서드
  addLog: (message: string) => void; // 로그를 추가하는 메서드
  clearLogs: () => void; // 모든 로그를 지우는 메서드
```

### 3. Web3.js와 소켓 통신

Web3.js를 처음 사용하면서 솔리디티의 메서드를 호출하는 방법과 소켓으로 이벤트를 구독할 수 있다는 점을 알게 되었습니다.

`useAuctionEvents` 훅을 만들어 각 이벤트가 발생할 때마다 받아오는 로그를 전역 상태로 관리하고 `LogBox` 컴포넌트에 로그를 출력하게끔 했습니다.

동시에, 이벤트에 따라 `getBalance()` 메서드를 호출하여 전역 상태로 관리되고 있는 `balance`를 서버의 최신 데이터와 동기화합니다.

이를 통해 사용자 인터페이스와 서버 간의 데이터 일관성을 유지합니다.

```typescript
// auctionInstance.ts
import Web3 from "web3";

const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
const auctionContract = new web3.eth.Contract(AuctionABI as AbiItem[], CONTRACT_ADDRESS);
```

```typescript
// useAuctionEvents
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
```
